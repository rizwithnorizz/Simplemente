import Sidebar from "./sidebar";

const Layout = ({ children }) => {
    document.title = "Simplemente";

    return ( 
        <div className="min-h-screen min-w-screen flex">
            <Sidebar />
            <main className="flex-1 lg:ml-64 h-screen overflow-y-auto p-4">
                {children}
            </main>
        </div>
    )
}

export default Layout;