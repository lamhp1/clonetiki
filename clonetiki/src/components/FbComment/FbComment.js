function FbComment(props) {
    const { dataHref } = props;
    return (
        <div style={{ width: '100%' }}>
            <div className="fb-comments" data-href={dataHref} data-width="100%" data-numposts="5"></div>
        </div>
    );
}

export default FbComment;
