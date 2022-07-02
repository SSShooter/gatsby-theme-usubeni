import React from 'react'
import { Link } from 'gatsby'

export default function (props) {
  return (
    <div className="css-info">
      <span
        style={{
          paddingRight: '12px',
        }}
      >
        {props.date}
      </span>
      {props.tags ? (
        <React.Fragment>
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
