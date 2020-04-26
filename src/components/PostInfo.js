import React from 'react'
import { Link } from 'gatsby'

export default function(props) {
  return (
    <div className="css-info">
      <span className="iconfont">&#xe7d3;</span>
      {props.date}
      {props.tags ? (
        <React.Fragment>
          <span className="iconfont">&#xe7e5;</span>
          {props.tags.map((tag, index) => (
            <span
              key={tag}
              style={{
                paddingRight: '8px',
              }}
            >
              <Link to={`/tag/${tag}`}>{tag}</Link>
            </span>
          ))}
        </React.Fragment>
      ) : null}
    </div>
  )
}
