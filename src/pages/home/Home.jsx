import React from "react";
import Featured from "../../components/featured/Featured";
import Slide from "../../components/Slide/Slide";
import TrustedBy from "../../components/trustedBy/TrustedBy";
import DashboardHome from "../../components/dashboard/DashboardHome";
import "./Home.scss"
import {cards, projects} from "../../data"
import CatCard from "../../components/catCard/CatCard";
import ProjectCard from "../../components/projectCard/ProjectCard";
import getCurrentUser from "../../utils/getCurrentUser";

const Home = () => {
    const currentUser = getCurrentUser();

    // If user is logged in, show the dashboard
    if (currentUser) {
        return <DashboardHome />;
    }

    // If user is not logged in, show the marketing/landing page
    return ( 
        <div className="home">
            <Featured></Featured>
            {/* <TrustedBy></TrustedBy> */}
            <br />
            <Slide 
                slidesToShow={5} 
                arrowsScroll={2} 
                title="Browse by Category"
                showDots={true}
                autoplay={false}
            >
                {cards.map(card=>(
                    <CatCard item={card} key={card.id}></CatCard>
                ))}
            </Slide>
            <div className="features">
                <div className="container">
                    <div className="item">
                        {/* <h1>Nairajobbers is the best solution for your business</h1> */}
                        <h1>Getting work done has never been easier</h1>
                        <div className="title">
                            <img src="./img/check.png" alt="" />
                            No cost until you hire
                        </div>
                        <p>Register and browse professionals, explore projects, interview potential fits for your job,
                            negotiate rates and only pay for work you approve.
                        </p>
                        <div className="title">
                            <img src="./img/check.png" alt="" />
                            The best for every budget
                        </div>
                        <p>Find high-quality services at every price point. No hourly rates, just project-based pricing.
                        </p>
                        <div className="title">
                            <img src="./img/check.png" alt="" />
                            Quality work delivered on time
                        </div>
                        <p>Connect with skilled professionals who deliver exceptional results within your timeline and budget requirements.
                        </p>
                        <div className="title">
                            <img src="./img/check.png" alt="" />
                            24/7 customer support
                        </div>
                        <p>Get help whenever you need it with our dedicated support team available around the clock.
                        </p>
                    </div>
                    <div className="item">
                        <video src="./img/video.mp4" controls></video>
                    </div>
                </div>
            </div>

            <div className="features dark">
                <div className="container">
                    <div className="item">
                        <h1>Nairalancers Business</h1>
                        <p>
                            This is how good companies find good company. Access the top 1% of talent on Nairalancers
                        </p>
                        <div className="title">
                            <img src="./img/check.png" alt="" />
                            Access expert talent to fill your skill gaps
                        </div>
                        <div className="title">
                            <img src="./img/check.png" alt="" />
                            Get matched with the perfect talent by a custom success manager
                        </div>
                        <div className="title">
                            <img src="./img/check.png" alt="" />
                            Control your workflow. Manage teamwork and boost productivity with one powerful workspace
                        </div>
                        <button>Explore Nairalancers Business </button>
                    </div>
                    <div className="item">
                        {/* <img src="./img/model.PNG" alt="" /> */}
                    </div>
                </div>
            </div>
            <Slide 
                slidesToShow={4} 
                arrowsScroll={2} 
                title="Inspiring Work Made on Nairalancers"
                showDots={true}
                autoplay={true}
            >
                {projects.map(card=>(
                    <ProjectCard item={card} key={card.id}></ProjectCard>
                ))}
            </Slide>
        </div>
     );
}
 
export default Home;