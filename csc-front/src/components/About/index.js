import React from 'react';
import { NavLink } from 'react-router-dom';
import './style.css';
import mahmoud from "./assets/mahmoud.jpeg";
import muhammedsheriff from "./assets/muhammedsheriff.jpeg";
import youseefezzat from "./assets/youseefezzat.jpeg";
import Typing from 'react-typing-animation';
export default class About extends React.Component {

  
    render(){
        return (
<section>
<div id="home" class="py-5">
<div class="background">
    	<div class="container">
		 <div class="row">
	 		<div class="col-sm-12">
			 <div class="pen">
       <Typing loop={true}>
    <span className="typing">IBM EGYPT.</span>
    <span className="typing" > CSC App To Analyze Everything Related to #IBM in Social Media</span>
    <Typing.Backspace count={"IBM EGYPT. CSC App To Analyze Everything Related to #IBM in Social Media".length} delay={500} />
  </Typing>  
            </div>
           </div>
        </div>
	    </div>
</div>
</div>

            
<div id="projects" class="bg-light text-center">       
     
     
     <h1 class=" pt-5 py-2 "> OUR TEAM</h1>
    
    <p class="mb-4"> </p>     
    
    < div class="container my-5">
          
          <div class="row">
                
          <div class="col-md-12 text-center">
<ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
<li class="nav-item col-sm-3 text-center">
    <a class="nav-link active" id="pills-home-tab" data-toggle="pill" href="#pills-home" role="tab" aria-controls="pills-home" aria-selected="true">ALL</a>
  </li>
  <li class="nav-item col-sm-3 text-center">
    <a class="nav-link" id="pills-profile-tab" data-toggle="pill" href="#pills-profile" role="tab" aria-controls="pills-profile" aria-selected="false">FRONT-END</a>
  </li>
  <li class="nav-item col-sm-3 text-center">
    <a class="nav-link" id="pills-contact-tab" data-toggle="pill" href="#pills-contact" role="tab" aria-controls="pills-contact" aria-selected="false">BACK-END</a>
  </li>
  <li class="nav-item col-sm-3 text-center">
    <a class="nav-link " id="pills-monitors-tab" data-toggle="pill" href="#pills-monitors" role="tab" aria-controls="pills-monitors" aria-selected="false">MONITORS</a>
  </li>
</ul>
</div>
</div>
</div>
<div class="tab-content" id="pills-tabContent">
  <div class="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
  
 < div class="container">
          
            <div class="row">
                  
            <div class="col-md-4">
        <img class="img-fluid" src={muhammedsheriff} width="400" height="400"/>      
        <h3> Muhammed Sheriff </h3>
        <p class="mb-4"> Front-end Developer</p>
                </div>
                <div class="col-md-4">
        <img class="img-fluid" src={muhammedsheriff} width="400" height="400"/>      
        <h3> Muhammed Sheriff </h3>
        <p class="mb-4"> Front-end Developer</p>
                </div>
                <div class="col-md-4">
        <img class="img-fluid" src={muhammedsheriff} width="400" height="400"/>      
        <h3> Muhammed Sheriff </h3>
        <p class="mb-4"> Front-end Developer</p>
                </div>
                <div class="col-md-4">  
        <img class="img-fluid" src={mahmoud} width="400" height="400"/>      
        <h3> Mahmoud Atwa </h3>
        <p class="mb-4"> Front-end Developer</p>
                </div>
                
                <div class="col-md-4">
        <img class="img-fluid" src={youseefezzat} width="400" height="400"/>
        <h3> Youseef Ezzat </h3>      
        <p class="mb-4"> Back-end Developer</p>
                </div>            
                
                <div class="col-md-4">  
        <img class="img-fluid" src={youseefezzat} width="400" height="400"/>      
        <h3> Youseef Ezzat</h3>
        <p class="mb-4"> Back-end Developer</p>
                </div>

              </div>
          
          </div>
  
  </div>
  <div class="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
  
  <div class="container">
          
            <div class="row">

                 <div class="col-md-6">
                    <img class="img-fluid" src={muhammedsheriff} width="400" height="400"/>      
                    <h3> Muhammed Sheriff </h3>
                    <p class="mb-4"> Front-end Developer</p>
                </div>

               <div class="col-md-6">  
                   <img class="img-fluid" src={mahmoud} width="400" height="400"/>      
                   <h3> Mahmoud Atwa </h3>
                   <p class="mb-4"> Front-end Developer</p>
                </div> 

              </div>
          
          </div>
  </div>
  <div class="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab">
  
  <div class="container">
          
            <div class="row">
              
            
            <div class="col-md-6">
        <img class="img-fluid" src={youseefezzat} width="400" height="400"/>
        <h3> Youseef Ezzat </h3>      
        <p class="mb-4"> Back-end Developer</p>
                </div>            
                
                <div class="col-md-6">  
        <img class="img-fluid" src={youseefezzat} width="400" height="400"/>      
        <h3> Youseef Ezzat </h3>
        <p class="mb-4"> Back-end Developer</p>
                </div>
              </div>
          
          </div>
  </div>
  <div class="tab-pane fade" id="pills-monitors" role="tabpanel" aria-labelledby="pills-monitors-tab">
  
  <div class="container">
          
            <div class="row">
              
            
                <div class="col-md-6">
        <img class="img-fluid" src="images/img2.gif"/>      
                </div>
                <div class="col-md-6">
                
        <img class="img-fluid" src="images/img5.jpg"/>      
                
                </div>
              </div>
          
          </div>
  </div>
</div>

      </div>

      
  </section>        
     
        )
    }
}