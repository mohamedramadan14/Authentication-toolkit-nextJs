const AuthLayout = ({children}: Readonly<{children: React.ReactNode}>) => {
    return <div className="h-full flex justify-center items-center bg-gradient-to-r from-slate-500 to-slate-800">
    {children}</div>;
}

export default AuthLayout