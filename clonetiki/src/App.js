import React, { Fragment, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import routes from './routes/';
import DefaultComponent from './components/DefaultComponent/DefaultComponent';
import { isJsonString } from './ultils';
import { jwtDecode } from 'jwt-decode';
import { axiosJwt, detailUser, refreshToken } from './services/UserService';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from './redux/slides/userSlice';
import Loading from './components/loadingComponent/Loading';

function App() {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    const user = useSelector((state) => {
        return state.user;
    });

    useEffect(() => {
        setIsLoading(true);
        const { accessToken, decode } = handleDecode();
        if (decode?.id && accessToken) {
            handleGetDetailUser(decode?.id, accessToken);
        }
        setIsLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDecode = () => {
        let accessToken = localStorage.getItem('access_token');
        let decode = {};
        if (accessToken && isJsonString(accessToken)) {
            accessToken = JSON.parse(accessToken);
            decode = jwtDecode(accessToken);
        }
        return { decode, accessToken };
    };

    axiosJwt.interceptors.request.use(
        async function (config) {
            const { decode } = handleDecode();
            const currentTime = new Date();
            if (decode?.exp < currentTime.getTime() / 1000) {
                const data = await refreshToken();
                // console.log('running');
                config.headers['token'] = `Bearer ${data?.accessToken}`;
                localStorage.setItem('access_token', JSON.stringify(data?.accessToken));
                handleGetDetailUser(decode?.id, data?.accessToken);
            }
            return config;
        },
        function (error) {
            // Làm gì đó với lỗi request
            return Promise.reject(error);
        },
    );

    const handleGetDetailUser = async (id, token) => {
        const res = await detailUser(id, token);
        // console.log('App token', token);
        dispatch(updateUser({ ...res?.data, accessToken: token }));
    };

    return (
        <div>
            <Loading isPending={isLoading}>
                <Router>
                    <Routes>
                        {routes.map((route, index) => {
                            const Page = route.page;
                            const isCheckAuth = !route.isPrivate || user.isAdmin;
                            const Layout = route.isShowHeader ? DefaultComponent : Fragment;
                            return (
                                <Route
                                    path={isCheckAuth && route.path}
                                    element={
                                        Layout === Fragment ? (
                                            <Page />
                                        ) : (
                                            <Layout isHiddenSearch={route.isHiddenSearch}>
                                                <Page />
                                            </Layout>
                                        )
                                    }
                                    key={index}
                                />
                            );
                        })}
                    </Routes>
                </Router>
            </Loading>
        </div>
    );
}

export default App;
