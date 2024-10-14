function FbLikeBtn(props) {
    const { dataHref } = props;
    return (
        <div style={{ marginTop: '10px' }}>
            <div
                className="fb-like"
                data-href={dataHref}
                data-width=""
                data-layout="standard"
                data-action="like"
                data-size="small"
                data-share="true"
            ></div>
        </div>
    );
}

export default FbLikeBtn;
