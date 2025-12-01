import { NavLink } from "react-router-dom";
function Pagination({totalPage,setCurrentPage}){
    return(
        <>
             <ul className="pagination">
                    {Array.from({ length: totalPage }, (_, index) => index + 1).map((page) => (
                        <li className="page-item" key={page}>
                            <NavLink className="page-link" onClick={() => setCurrentPage(page)}>{page}</NavLink>
                        </li>
                    ))}
            </ul>
        </>
    )
}
export default Pagination