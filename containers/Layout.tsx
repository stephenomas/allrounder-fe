import { useContext, useState} from 'react'
import SidebarContext, { SidebarProvider } from 'context/SidebarContext'
import Sidebar from 'example/components/Sidebar'
import Header from 'example/components/Header'
import Main from './Main'
import Cookie from 'js-cookie';
import { useRouter } from 'next/router';
import {useEffect} from 'react';




interface ILayout{
  children: React.ReactNode
}




function Layout({ children }: ILayout) {
  const { isSidebarOpen } = useContext(SidebarContext); 
  const [check, setCheck] = useState(true)
  const router = useRouter();
  useEffect(  () => {
 const checkAuthentication = async () => {
   if (!Cookie.get("AUTH_TOKEN")) {
     await router.push("/login"); // Use await to ensure the redirection is complete
   }
   setCheck(false); // Set loading state to false after the check
 };

 checkAuthentication();
  }, []);
  if(check){
    return null
  }
  
  return <SidebarProvider>
    <div
      className={`flex h-screen bg-gray-50 dark:bg-gray-900 ${isSidebarOpen && 'overflow-hidden'}`}
      >
      <Sidebar />
      <div className="flex flex-col flex-1 w-full">
        <Header />
        <Main>
          {children}
        </Main>
      </div>
    </div>
  </SidebarProvider>
}

export default Layout