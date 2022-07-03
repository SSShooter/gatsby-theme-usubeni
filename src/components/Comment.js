import CommentSubmit from './CommentSubmit'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { apiUrl } from '../settings'

const dateFormat = (date) => {
  date = new Date(date)
  let m = date.getMonth() + 1
  m = m < 10 ? '0' + m : m
  let d = date.getDate()
  d = d < 10 ? '0' + d : d
  return `${date.getFullYear()}-${m}-${d}`
}
export default function Comment({ slug }) {
  const [replyData, setReplyData] = useState({
    parentId: null,
    to: null,
  })
  const cancelReply = () => {
    setReplyData({
      parentId: null,
      to: null,
    })
  }
  const reply = (parentId, to) => () => {
    document.querySelector('#comment-input').scrollIntoView()
    setReplyData({
      parentId,
      to,
    })
  }

  const [comments, setComments] = useState([])
  const getComment = async () => {
    try {
      const { data } = await axios.get(
        apiUrl + '/api/comment/' + slug.slice(1, -1)
      )
      setComments(data.data)
    } catch (e) {
      console.error(e)
    }
  }
  useEffect(() => {
    getComment()
  })

  const CommentDisplay = ({ item, comment }) => {
    const date = dateFormat(item.date)
    return (
      <div className="css-child-comment-display">
        <div className="name">
          {item.site ? (
            <a target="_blank" href={item.site}>
              {item.author}
            </a>
          ) : (
            <span>{item.author}</span>
          )}
          {' -> ' + item.to}
          <span className="date">{date}</span>
          <span
            className="inline-button css-reply"
            onClick={reply(comment._id, item.author)}
          >
            回复
          </span>
        </div>
        <div className="message">{item.content}</div>
      </div>
    )
  }
  return (
    <>
      {comments.length > 0
        ? comments.map((comment) => {
            return (
              <React.Fragment>
                <CommentDisplay item={comment} />
                {comment.replies.length > 0
                  ? comment.replies.map((commentChild) => {
                      return (
                        <CommentDisplay
                          item={commentChild}
                          parent={comment}
                          key={commentChild._id}
                        />
                      )
                    })
                  : null}
              </React.Fragment>
            )
          })
        : '暂时没有留言，要抢沙发吗？'}
      <CommentSubmit
        url={slug}
        parent={replyData.parentId}
        to={replyData.to}
        onCancel={cancelReply}
        onSuccess={getComment}
      />
    </>
  )
}
