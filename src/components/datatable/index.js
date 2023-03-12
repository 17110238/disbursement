import React, { useState, useMemo, useEffect } from 'react';
import {
  useTable,
  usePagination,
  useSortBy,
  useFilters,
  useRowSelect,
  useBlockLayout,
} from 'react-table';
import LoadingInline from 'components/loading/LoadingInline';
import ImageNoData from 'assets/images/Nodata.jpg';
import { Checkbox } from './Checkbox';
import { onlyNumber } from 'helpers/onlyNumber';

const Index = ({
  getDataList,
  paging,
  tableColumn,
  tableData,
  isLoading,
  onDataSelectedRow,
  limit,
  setLimit,
}) => {
  const showCurrentPage = [20, 50, 100];
  const [start, setStart] = useState(null);
  const [toPage, setToPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [disable, setDisable] = useState(false);
  const [isChangeSearch, setIsChangeSearch] = useState(false);
  const columns = useMemo(() => tableColumn, []);
  const [next, setNext] = useState(null);
  const [pre, setPre] = useState([null]);
  const data = useMemo(() => tableData, [tableData]);
  const { filter, getList, submitForm, setSubmitForm } = getDataList?.();

  useEffect(() => {
    setIsChangeSearch(true);
    if (filter?.searchBy) {
      setPre([null]);
    }
    const payload = {
      ...filter,
      exclusiveStartKey: isChangeSearch ? null : next,
      limit,
    };
    submitForm && getList?.(payload);
  }, [submitForm, filter?.searchBy]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    selectedFlatRows,
    setPageSize,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 20 },
    },
    useFilters,
    useSortBy,
    usePagination,
    useRowSelect,
    useBlockLayout,
    (hooks) => {
      hooks.visibleColumns.push((tableColumns) => [
        {
          id: 'selection',
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <Checkbox {...getToggleAllRowsSelectedProps()} />
          ),
          disableSortBy: true,
          Cell: ({ row }) => {
            return <Checkbox {...row.getToggleRowSelectedProps()} />;
          },
          width: 50,
        },
        ...tableColumns,
      ]);
    }
  );

  useEffect(() => {
    setPageSize(limit);
  }, [limit]);

  const handleNextPage = () => {
    setIsChangeSearch(false);
    const preCopy = [...pre];
    preCopy.push(paging);
    setPre(preCopy);
    setNext(paging);
    setSubmitForm(true);
  };

  const handlePreviousPage = () => {
    const preCopy = [...pre];
    const preNew = preCopy.slice(0, preCopy.length - 1);
    const lastValue = preNew.slice(-1)[0];
    setNext(lastValue);
    setPre(preNew);
    setSubmitForm(true);
  };

  const handleChangePageSize = (e) => {
    const value = +e.target.value;
    setNext(null);
    setLimit(value);
    setSubmitForm(true);
  };

  // const changeHandler = (e) => {
  //   const page = +e.target.value;
  //   if (page > 0 && page <= totalPage) {
  //     setToPage(page);
  //     setStart(page);
  //     setDisable(true);
  //     setTimeout(() => {
  //       setToPage((page) => page);
  //       setStart((page) => page);
  //       setSubmitForm(true);
  //       setDisable(false);
  //     }, 1000);
  //   } else {
  //     setToPage('');
  //   }
  // };

  useEffect(() => {
    const data = selectedFlatRows.map((item) => item.original.paymentId);
    onDataSelectedRow(data);
  }, [selectedFlatRows]);

  return (
    <div className='data-table-custom'>
      <LoadingInline loading={isLoading} />
      {tableData.length > 0 ? (
        <>
          <div className='data-table-wrap'>
            <table className='my-3 ' {...getTableProps()}>
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps(
                          typeof column.render('Header') === 'string' &&
                            column.getSortByToggleProps()
                        )}>
                        <div>
                          <span> {column.render('Header')}</span>
                          <span>
                            {typeof column.render('Header') === 'string' ? (
                              column.isSorted ? (
                                column.isSortedDesc ? (
                                  <i className='mdi mdi-arrow-down-bold' />
                                ) : (
                                  <i className='mdi mdi-arrow-up-bold' />
                                )
                              ) : (
                                <i className='mdi mdi-arrow-up-down-bold' />
                              )
                            ) : (
                              ''
                            )}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className='scroll' {...getTableBodyProps()}>
                {page.map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => {
                        return (
                          <td className='p-3' {...cell.getCellProps()}>
                            {cell.render('Cell')}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className='data-table-change-page'>
            <div className='select-ui'></div>
            <div className='select-pagination'>
              <div className='custom-select-show'>
                <span>Show: </span>
                <select value={limit} onChange={(e) => handleChangePageSize(e)}>
                  {showCurrentPage.map((page) => (
                    <option className='font-weight-bold' key={page} value={page}>
                      {page}
                    </option>
                  ))}
                </select>
              </div>
              {/* <div className='custom-page-show'>
                <span>Page:</span>
                <span>
                  {start} of {totalPage}
                </span>
                <span>|</span>
                <span>To page</span>
                <input
                  value={toPage}
                  className='go-to-page'
                  type='number'
                  disabled={disable}
                  onKeyPress={onlyNumber}
                  onChange={changeHandler}
                />
              </div> */}
              <div className='custom-group-change-page'>
                <i
                  onClick={pre.length === 1 ? null : handlePreviousPage}
                  className={`ti-angle-left icon-pre ${
                    pre.length === 1 ? 'text-light disable-pointer' : ' text-dark '
                  }`}
                />
                <i
                  onClick={!paging ? null : handleNextPage}
                  className={`ti-angle-right icon-next ${
                    !paging ? 'text-light disable-pointer' : ' text-dark'
                  }`}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className='no-data'>{isLoading ? '' : <img src={ImageNoData} alt='No data' />}</div>
      )}
    </div>
  );
};

export default Index;
