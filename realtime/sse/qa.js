const http = require('node:http')
const url = require('node:url')
const crypto = require('node:crypto')
const fs = require('node:fs')

const clients = new Map()
const clientQMap = new Map()
const questions = new Map()
const answers = new Map()

function removeClient(id) {
    if (id) {
        clients.delete(id)
        clientQMap.delete(id)
    }
}

http.createServer((req, res) => {
    let args = url.parse(req.url, true).pathname.split('/')
    args.shift()
    let method = args.shift()
    let parameter = decodeURIComponent(args[0])
    let sseUserId = req.headers['_sse_user_id_']

    function broadcast(toId, msg, eventName) {
        if (toId === '*') {
            return clients.forEach((_, id) => broadcast(id, msg))
        }
        const clientSocket = clients.get(toId)
        if (!clientSocket) return
        if (eventName) clientSocket.write(`event: ${eventName}\n`)
        clientSocket.write(`id: ${crypto.randomInt(1000 * 1000 * 100)}\n`)
        clientSocket.write(`data: ${JSON.stringify(msg)}\n\n`)
    }

    if (method === 'login') {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
        })
        res.write(Array(2049).join(' ') + '\n')
        res.write('retry: 2000\n')
        removeClient(sseUserId)
        sseUserId = crypto.randomInt(1000 * 1000)
        clients.set(sseUserId, res)

        broadcast(sseUserId, {
            type: 'login',
            userId: sseUserId
        })
        broadcast(sseUserId, {
            type: 'questions',
            questions: Object.fromEntries(questions)
        })
        res.on('close', () => {
            removeClient(sseUserId)
        })

        setInterval(() => {
            broadcast(sseUserId, new Date().getTime(), 'ping')
        }, 10 * 1000)
        return
    }

    if (method === 'askquestion') {
        if (questions.has(parameter)) {
            return res.end('already asked')
        }
        questions.set(parameter, sseUserId)
        broadcast('*', {
            type: 'questions',
            questions: Object.fromEntries(questions)
        })
        return res.end()
    }

    if (method === 'addanswer') {
        if (!parameter) {
            broadcast(sseUserId, {
                type: 'notification',
                message: 'Answer cannot be empty'
            })
            return res.end()
        }
        const curUserQuestion = clientQMap.get(sseUserId)
        if (!curUserQuestion) {
            broadcast(sseUserId, {
                type: 'notification',
                message: 'You have not asked any question'
            })
            return res.end()
        }
        answers.set(curUserQuestion, answers.get(curUserQuestion) || [])
        answers.set(curUserQuestion, [...answers.get(curUserQuestion), parameter])
        clientQMap.forEach((_, id) => {
            if (clientQMap.get(id) === curUserQuestion) {
                broadcast(id, {
                    type: 'answers',
                    question: curUserQuestion,
                    answers: answers.get(curUserQuestion)
                })
            }
        })
        return res.end()
    }

    if (method === 'selectquestion') {
        if (parameter && questions.has(parameter)) {
            clientQMap.set(sseUserId, parameter)
            broadcast(sseUserId, {
                type: 'answers',
                question: parameter,
                answers: answers.get(parameter) || []
            })
        }
        return res.end()
    }
    if (!method) {
        return fs.createReadStream('qa.html', { encoding: 'utf-8' }).pipe(res)
    }
}).listen(8080, () => console.log('Server running at http://localhost:8080/'))