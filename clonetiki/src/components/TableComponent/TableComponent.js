import { Table } from 'antd';
import Loading from '../loadingComponent/Loading';
import { useState } from 'react';
import Button from '../ButtonComponent/ButtonComponent';

const TableComponent = (props) => {
    const { columns = [], data = [], isPending = false, handleDeleteMany } = props;

    const [ids, setIds] = useState([]);

    // rowSelection object indicates the need for row selection
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setIds(selectedRowKeys);
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === 'Disabled User',
            // Column configuration not to be checked
            name: record.name,
        }),
    };

    const handleDeleteAll = () => {
        handleDeleteMany(ids);
    };

    return (
        <div>
            <Loading isPending={isPending}>
                {ids.length !== 0 && (
                    <Button onClick={handleDeleteAll} outline style={{ margin: '4px 0 4px 0', height: '32px' }}>
                        Xóa đã chọn
                    </Button>
                )}
                <Table
                    rowSelection={{
                        type: 'checkbox',
                        ...rowSelection,
                    }}
                    scroll={{ x: 'max-content' }}
                    columns={columns}
                    dataSource={data}
                    {...props}
                />
            </Loading>
        </div>
    );
};
export default TableComponent;
