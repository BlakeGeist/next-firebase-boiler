import React from "react";
import Link from "next/link";
import _ from "lodash";

const Pagination = ({ pagination }) => {
    const { data, listingsPerPage, totalPaginateditems, activePageNumber } = pagination;
    const paginateXTimes = Math.ceil(totalPaginateditems / listingsPerPage);

    const PaginatedItem = () => {
        let items = [];

        _.times(paginateXTimes, (i) => {
            const number = i + 1;
            let paginatedItemClass = "";
            if (activePageNumber === number) {
                paginatedItemClass = "is-active";
            }
            items.push(
                <Link key={i} href={`/sets/${number}`}><a className={paginatedItemClass}>{number}</a></Link>
            );
        });

        return items;
    };

    return (
        <div className="pagination-container">
            <PaginatedItem />
            <style global jsx>{`
        .pagination-container{
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
        }
        .pagination-container a {
          border: 1px solid #ccc;
          height: 25px;
          width: 25px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .is-active {
          background-color: yellow;
        }
        table{
          width: 100%;
        }
        `}</style>
        </div>
    );
};

export default Pagination;
