import React from 'react';
import {
    Navbar,
    Home,
    About,
    Teacher,
    Contact,
    Courses,
    Footer,
    Support,
  } from "../../components/index";

function HomePage() {
  return (   
 <>
            <div className= " font-Poppins bg-white">
            <Navbar/>
            <Home />
            <About />
            <Courses />
            <Teacher />
            <Support/>
            <Contact />
            <Footer />
          </div>

          </>
      ) 
    }
 
  

export default HomePage;

