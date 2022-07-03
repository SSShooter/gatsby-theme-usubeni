import React from 'react'
import { Link } from 'gatsby'
export default function (props) {
  const { currentPage, totalPage, prefix } = props
  return (
    <div className="button-wrapper">
      {currentPage - 1 > 0 && (
        <Link
          to={prefix + (currentPage - 1 === 1 ? '' : currentPage - 1)}
          rel="prev"
        >
          <button className="page-button">上一页</button>
        </Link>
      )}
      <div>{`${currentPage} / ${totalPage}`}</div>
      {currentPage + 1 <= totalPage && (
        <Link to={prefix + (currentPage + 1)} rel="next">
          <button className="page-button">下一页</button>
        </Link>
      )}
    </div>
  )
}
