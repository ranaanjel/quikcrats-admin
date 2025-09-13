import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './customUI/theme-provider';
import { Layout } from './pages/layout';
import { Dashboard } from './pages/dashboard';
import { NotFound } from './pages/notFound';
import { Price } from './pages/price';
import { Items } from './pages/items';
import { Builtin } from './pages/builtin';
import { Orders } from './pages/orders';
import { Customer } from './pages/customer';
import {Help, Login, Setting} from "./pages/login"
import { useEffect } from 'react';

function App() {

  useEffect(function (){

   

    if("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js",{
        scope:"/"
      }).then(_ => {
        console.log("service registered is successfully registered")
      }).catch(err => {
        console.log(err, "service registered is not registered.")
      })
    }

  },[])

  return  <div className="dark:bg-black dark:text-white bg-(--foreground-color) text-black w-screen h-screen sm:overflow-hidden">
  <ThemeProvider>
    <Router>
    <Routes>
    <Route path='/' element={<Layout></Layout>}>

      <Route index element={<Dashboard></Dashboard>}></Route>
      <Route path='/pricelist' element={<Price></Price>}></Route>
      <Route path='/itemlist' element={<Items></Items>}></Route>
      <Route path='/builtinlist' element={<Builtin></Builtin>}></Route>
      <Route path='/orderlist' element={<Orders></Orders>}></Route>
      <Route path='/customerlist' element={<Customer></Customer>}></Route>
      <Route path='/help' element={<Help></Help>}></Route>
      <Route path='/setting' element={<Setting></Setting>}></Route>
    </Route>
      <Route path='/login' element={<Login></Login>}></Route>
      <Route path="*" element={<NotFound></NotFound>}></Route>
    </Routes>
    </Router>
  </ThemeProvider>
  </div> 
}


export default App
