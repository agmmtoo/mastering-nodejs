'use strict'

function LikeButton() {
    const [like, setLike] = React.useState(false)
    return (
        <button onClick={() => setLike(like => !like)}>
            {like ? 'Unlike' : 'Like'}
        </button>
    )
}

const domContainer = document.querySelector('#root')
const root = ReactDOM.createRoot(domContainer)
root.render(<LikeButton />)