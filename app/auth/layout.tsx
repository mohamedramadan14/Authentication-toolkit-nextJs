const AuthLayout = ({children}: Readonly<{children: React.ReactNode}>) => {
    return <div className="h-full flex justify-center items-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-700">
    {children}</div>;
}

export default AuthLayout