import { Spin } from 'antd';

function Loading({ children, isPending = false, delay = 200 }) {
    return (
        <Spin spinning={isPending} delay={delay}>
            {children}
        </Spin>
    );
}

export default Loading;
