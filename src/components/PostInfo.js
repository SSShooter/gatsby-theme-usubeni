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
        <>
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
        </>
      ) : null}
      {props.multiLang ? (
        <div>
          Also Available In: 
          {props.multiLang?.map((lang) => (
            <a href={`/${lang}${props.slug}`} className='multi-lang'>{lang.toUpperCase()}</a>
          ))}
        </div>
      ) : null}
    </div>
  )
}
