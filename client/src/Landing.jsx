import React, { useContext, useEffect, useState } from "react";
import TopBar from "./components/TopBar";
import heroImg from "./assets/hero-img.png";
import { Grid, Rating } from "@mui/material";
import { AppContext } from "./store/AppProvider";
import BudgetIcon from "@mui/icons-material/AttachMoney";
import AnalyticsIcon from "@mui/icons-material/Insights";
import BillsIcon from "@mui/icons-material/Receipt";
import PaymentsIcon from "@mui/icons-material/Payments";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import logo from "./assets/m-paymate.png";
import { axiosInstance } from "./axios/axios";

import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import InfoBox from "./components/InfoBox";

const Landing = () => {
  const [testimonials, setTestimonials] = useState([]);
  const { handleNavigate } = useContext(AppContext);


  const settings = {
    // dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoPlay:true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  async function getTestimonials() {
    try {
      const { data } = await axiosInstance.get("/testimonials?page=all");
  console.log(data);
      setTestimonials(data)
    } catch (error) {
      console.log(error);
    }
  }



  useEffect(() => {
    getTestimonials();
  }, []);
  return (
    <div>
      <TopBar />
      <div className="hero-section">
        <Grid container spacing={2} className="landing-container">
          <Grid item xs={12} sm={6} className="image-content">
            <img src={heroImg} alt="Finance Management" />
          </Grid>
          <Grid item xs={12} sm={6} className="text-content">
            <h1>Take Control of Your Finances</h1>
            <p>
              Welcome to our budget and bills tracking application. Simplify
              your financial life and stay on top of your expenses effortlessly.
            </p>
            <button
              className="get-started-button"
              onClick={() => handleNavigate("/register")}
            >
              Get Started
            </button>
          </Grid>
        </Grid>
      </div>

      <div className="features-section" id="features">
        <div className="feature-row">
          <div className="feature-card">
            <AnalyticsIcon className="feature-icon" />
            <h3 className="feature-title">Analytics</h3>
            <p className="feature-description">
              Get detailed insights and visualizations to track your budget
            </p>
          </div>
          <div className="feature-card">
            <BudgetIcon className="feature-icon" />
            <h3 className="feature-title">Track Budget Spendings</h3>
            <p className="feature-description">
              Monitor your expenses and stay on top of your budget.
            </p>
          </div>
          <div className="feature-card">
            <BillsIcon className="feature-icon" />
            <h3 className="feature-title">Tracking Bills</h3>
            <p className="feature-description">
              Keep track of all your bills, due dates, and payment history in
              one place.
            </p>
          </div>
          <div className="feature-card">
            <PaymentsIcon className="feature-icon" />
            <h3 className="feature-title">Payments with M-Pesa</h3>
            <p className="feature-description">
              Seamlessly pay your bills using M-Pesa, the popular mobile money
              service.
            </p>
          </div>
        </div>
      </div>


      <div className="testimonial-section">
      <h2 className="section-title">Testimonials</h2>
      {testimonials.length  === 0 &&  <div className="message-box">No Testimonial Found</div>}
      <Slider {...settings}>
        {testimonials?.map((testimonial, index) => (
          <div key={index} className="testimonial-card">
            <div className="rating">
            <Rating value={testimonial.rating} readOnly precision={0.5} />
                   
              </div>
            <p className="description">{testimonial.description}</p>
            <div className="author">{testimonial.name}</div>
          </div>
        ))}
      </Slider>
    </div>




      <footer className="footer">
        <div className="footer-content">
          <div className="copyright">
            &copy; 2024 <img src={logo} className="footer-img" alt="" />
          </div>
          <div className="social-icons">
            <a
              href="https://twitter.com/m-paymate"
              target="_blank"
              rel="noopener noreferrer"
            >
              <TwitterIcon className="social-icon" />
            </a>
            <a
              href="https://www.facebook.com/m-paymate"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FacebookIcon className="social-icon" />
            </a>
            <a
              href="https://www.instagram.com/m-paymate"
              target="_blank"
              rel="noopener noreferrer"
            >
              <InstagramIcon className="social-icon" />
            </a>
            <a
              href="https://www.youtube.com/m-paymate"
              target="_blank"
              rel="noopener noreferrer"
            >
              <YouTubeIcon className="social-icon" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
