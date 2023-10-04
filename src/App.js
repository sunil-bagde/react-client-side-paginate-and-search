import "./styles.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getSearchParam } from "./useSearchParam";
import productData from "./product-data.json";
const products = productData.products;

const perPage = 5;
const searchParam = "page";
export default function App() {
  const location = useLocation();
  const navigation = useNavigate();
  const pageParam = getSearchParam(searchParam, location);
  const search = getSearchParam("search", location);
  let currentPage = parseInt(pageParam, 10) ? parseInt(pageParam, 10) : 1;

  let skip = perPage * (currentPage - 1);
  let take = perPage;
  let data = products;

  if (search) {
    data = data.filter(({ title, description }) => {
      return (
        title.toLowerCase().includes(search?.toLowerCase()) ||
        description.toLowerCase().includes(search?.toLowerCase())
      );
    });
  }

  const totalPages = Math.ceil(data.length / perPage);
  currentPage = currentPage > 1 && currentPage <= totalPages ? currentPage : 1;

  const currentSearchParam = new URLSearchParams();
  if (search) {
    currentSearchParam.set("search", search);
  }
  if (currentPage > 1) {
    currentSearchParam.set("page", currentPage);
  }
  console.log({ currentSearchParam: currentSearchParam.toString() });
  return (
    <>
      <div className="App">
        <div className="flex items-center justify-center mt-3">
          <h1 className="inline-block text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight dark:text-slate-200">
            Product list
          </h1>
        </div>
        <div className="mt-2  w-full px-4 min-w-0 lg:px-6 xl:w-3/4 xl:px-12">
          <div
            className="relative  py-5 
    block w-full appearance-none leading-normal border border-transparent rounded-lg text-left  bg-gray-50
          "
          >
            <div className="border border-solid rounded-md border-grey-300 w-full absolute inset-y-0 left-0 pl-4 flex items-center">
              <svg
                className="fill-current  text-gray-600 w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z" />
              </svg>
              <input
                defaultValue={currentSearchParam.toString()}
                className="text-md text-gray-700 pl-2 bg-transparent
               py-2.5 w-full outline-none"
                placeholder="Search"
                onBlur={({ target: { value } }) => {
                  navigation(`/?search=${value}`);
                  return;
                }}
              />
            </div>
          </div>
        </div>
        <div className="shadow-sm overflow-hidden my-8">
          <table className="border-collapse table-auto w-full text-sm">
            <thead>
              <tr>
                <th className="border-b dark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">
                  Title
                </th>
                <th className="border-b dark:border-slate-600 font-medium p-4 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">
                  Description
                </th>
                <th className="border-b dark:border-slate-600 font-medium p-4 pr-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">
                  price
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800">
              {data
                .slice(skip, skip + take)
                .map(({ id, title, description, price }) => {
                  return (
                    <tr key={id}>
                      <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
                        {title}
                      </td>
                      <td className="border-b border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">
                        {description}
                      </td>
                      <td className="border-b border-slate-100 dark:border-slate-700 p-4 pr-8 text-slate-500 dark:text-slate-400">
                        {price}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex items-center ">
        <div className="pl-2 flex-1 text-sm text-gray-700">
          Showing{" "}
          <span className="font-bold"> {(currentPage - 1) * perPage + 1} </span>
          to{"  "}
          <span className="font-bold">
            {Math.min(currentPage * perPage, data.length)}
          </span>{" "}
          of
          <span className="font-bold"> {data.length} </span>
          users
        </div>
        <div className="flex justify-end px-2">
          <PrevPage
            currentSearchParam={currentSearchParam}
            currentPage={currentPage}
            totalPages={totalPages}
          />
          <NextPage
            currentSearchParam={currentSearchParam}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </div>
      </div>
    </>
  );
}

function PrevPage({ currentPage, totalPages, currentSearchParam }) {
  const newSearchParam = new URLSearchParams(currentSearchParam);

  if (currentPage > 2) {
    newSearchParam.set("page", currentPage - 1);
  } else {
    newSearchParam.delete("page");
  }
  return (
    <Link
      to={`/?${newSearchParam.toString()}`}
      className={`${currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
          border border-grey-300 px-4 py-3`}
    >
      Prev
    </Link>
  );
}
function NextPage({ currentPage, totalPages, currentSearchParam }) {
  const newSearchParam = new URLSearchParams(currentSearchParam);
  newSearchParam.set("page", currentPage + 1);
  const noNextPage = currentPage < totalPages;
  console.log(noNextPage, newSearchParam.toString());
  return (
    <Link
      to={
        currentPage < totalPages
          ? `/?${newSearchParam.toString()}`
          : `/?page=${currentPage}`
      }
      className={`${
        currentPage >= totalPages ? "pointer-events-none opacity-50" : ""
      } border border-l-0 border-grey-300 px-4 py-3`}
    >
      Next
    </Link>
  );
}
