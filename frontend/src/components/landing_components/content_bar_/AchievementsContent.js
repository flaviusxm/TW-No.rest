import React, { useEffect, useState } from 'react';

import rookieImg from '../../../assets/badgeuritw/Rookie.png';
import scribeImg from '../../../assets/badgeuritw/Scribe.png';
import scholarImg from '../../../assets/badgeuritw/Scholar.png';
import wordsmithImg from '../../../assets/badgeuritw/Wordsmith.png';
import novelWriterImg from '../../../assets/badgeuritw/Novel-Writer.png';
import thePerfectionistImg from '../../../assets/badgeuritw/The-Perfectionist.png';
import timeTravelerImg from '../../../assets/badgeuritw/Time-Traveler.png';
import dailyChroniclerImg from '../../../assets/badgeuritw/Daily-Chronicler.png';
import thePioneerImg from '../../../assets/badgeuritw/The-Pioneer.png';
import polymathImg from '../../../assets/badgeuritw/Polymath.png';
import deepDiverImg from '../../../assets/badgeuritw/Deep-Diver.png';
import theTaggerImg from '../../../assets/badgeuritw/The-Tagger.png';
import theConnectorImg from '../../../assets/badgeuritw/The-Connector.png';
import minimalistImg from '../../../assets/badgeuritw/Minimalist.png';
import resourceGathererImg from '../../../assets/badgeuritw/Resource-Gatherer.png';
import visualLearnerImg from '../../../assets/badgeuritw/Visual-Learner.png';
import theStreamerImg from '../../../assets/badgeuritw/The-Streamer.png';
import researcherImg from '../../../assets/badgeuritw/Researcher.png';
import multimediaMasterImg from '../../../assets/badgeuritw/Multimedia-Master.png';
import theFounderImg from '../../../assets/badgeuritw/The-Founder.png';
import communityLeaderImg from '../../../assets/badgeuritw/Community-Leader.png';
import squadGoalsImg from '../../../assets/badgeuritw/Squad-Goals.png';
import nightOwlImg from '../../../assets/badgeuritw/Night-Owl.png';
import earlyBirdImg from '../../../assets/badgeuritw/Early-Bird.png';
import marathonRunnerImg from '../../../assets/badgeuritw/Marathon-Runner.png';
import springCleanerImg from '../../../assets/badgeuritw/Spring-Cleaner.png';
import fullStackImg from '../../../assets/badgeuritw/Full-Stack.png';
import theArchitectImg from '../../../assets/badgeuritw/The-Architect.png';
import openSourceImg from '../../../assets/badgeuritw/Open-Source.png';
import infinityGauntletImg from '../../../assets/badgeuritw/Infinity-Gauntlet.png';

const badgeImages = {
    rookie: rookieImg,
    scribe: scribeImg,
    scholar: scholarImg,
    wordsmith: wordsmithImg,
    novel_writer: novelWriterImg,
    the_perfectionist: thePerfectionistImg,
    time_traveler: timeTravelerImg,
    daily_chronicler: dailyChroniclerImg,
    the_pioneer: thePioneerImg,
    polymath: polymathImg,
    deep_diver: deepDiverImg,
    the_tagger: theTaggerImg,
    the_connector: theConnectorImg,
    minimalist: minimalistImg,
    resource_gatherer: resourceGathererImg,
    visual_learner: visualLearnerImg,
    the_streamer: theStreamerImg,
    researcher: researcherImg,
    multimedia_master: multimediaMasterImg,
    the_founder: theFounderImg,
    community_leader: communityLeaderImg,
    squad_goals: squadGoalsImg,
    night_owl: nightOwlImg,
    early_bird: earlyBirdImg,
    marathon_runner: marathonRunnerImg,
    spring_cleaner: springCleanerImg,
    full_stack: fullStackImg,
    the_architect: theArchitectImg,
    open_source: openSourceImg,
    infinity_gauntlet: infinityGauntletImg
};

const badgeDescriptions = {
  rookie: "Created your first 10 notes.",
  scribe: "Created 50 notes.",
  scholar: "Created 100 notes.",

  wordsmith: "Wrote more than 10,000 words.",
  novel_writer: "Wrote more than 50,000 words.",
  the_architect: "Created a note with over 2000 words.",

  the_perfectionist: "Edited your notes at least 10 times.",
  minimalist: "Created a note with a title but no content.",
  spring_cleaner: "Deleted an old note.",

  time_traveler: "Created a note with a future date.",
  daily_chronicler: "Created one note per day for 7 days.",
  marathon_runner: "Created one note per day for 30 days.",
  night_owl: "Created 5 notes between 00:00 and 05:00.",
  early_bird: "Created 5 notes between 05:00 and 08:00.",

  the_pioneer: "Created your first subject.",
  polymath: "Created notes across 10 different subjects.",
  deep_diver: "One of your subjects has over 50 notes.",

  the_tagger: "Created 20 tags.",
  the_connector: "Used one tag on at least 5 notes.",

  resource_gatherer: "Attached over 50 files.",
  visual_learner: "Attached 10 images.",
  the_streamer: "Attached 10 videos.",
  researcher: "Attached 10 PDF files.",
  multimedia_master: "A note contains a PDF, video, and image.",

  the_founder: "Created your first group.",
  community_leader: "Created 5 groups.",
  squad_goals: "One of your groups has at least 10 members.",

  full_stack: "Created a subject, a tag, a group, and a note.",
  open_source: "Shared 10 notes.",
  
  infinity_gauntlet: "Unlocked all other 29 achievements."
};
export default function AchievementsContent() {

    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetch_achievements = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:5019/achievements', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const data = await response.json();
                setAchievements(data);

            } catch (err) {
                console.error("Eroare incarcare achievements:", err);
            } finally {
                setLoading(false);
            }
        };

        fetch_achievements();
    }, []);

    return (
       <div className="flex-1 p-4 lg:p-6 overflow-auto h-full">

            
            <div className="mb-6 border-b pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg text-yellow-500 bg-yellow-50 shrink-0">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a7 7 0 007-7V4H5v4a7 7 0 007 7z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v7" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 22h12" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 4H4.5a2.5 2.5 0 000 5H5" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 4h.5a2.5 2.5 0 010 5H19" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Your Achievements</h2>
                            <p className="text-sm text-gray-500">Collect them all to become a master!</p>
                        </div>
                    </div>

                    <div className="flex gap-3 w-full sm:w-auto">
                        <div className="w-full sm:w-auto text-center px-4 py-2 rounded-lg bg-white border text-sm text-gray-600 font-medium shadow-sm">
                            {achievements.filter(a => a.unlocked).length} / {achievements.length} Unlocked
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <p className="text-center text-gray-400 mt-10">Loading badges...</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-10">
                    {achievements.map(ach => (
                        <div
                            key={ach.id}
                            className={`relative bg-white p-4 rounded-xl shadow-sm border transition-all duration-300 hover:shadow-md flex flex-col items-center text-center group ${
                                !ach.unlocked ? 'bg-gray-50 border-gray-200' : 'border-purple-100 ring-1 ring-purple-50'
                            }`}
                        >
                            <div className={`w-20 h-20 mb-2 transition-all duration-500 ${
                                ach.unlocked ? 'filter-none scale-100' : 'grayscale opacity-40 group-hover:scale-105'
                            }`}>
                                <img
                                    src={badgeImages[ach.id]}
                                    alt={ach.title}
                                    className="w-full h-full object-contain drop-shadow-md"
                                    onError={e => { e.target.src = 'https://via.placeholder.com/100?text=?'; }}
                                />
                            </div>

                            <h4 className={`font-bold text-base mb-1 ${ach.unlocked ? 'text-gray-800' : 'text-gray-400'}`}>
                                {ach.title}
                            </h4>

                           <p className="text-xs text-gray-500 mb-2 h-8 line-clamp-2 px-1 flex items-center justify-center">
                {badgeDescriptions[ach.id]}
            </p>

                            <div className="mt-auto w-full pt-2 border-t border-gray-100 flex justify-center">
                                {ach.unlocked ? (
                                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100 flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Unlocked
                                    </span>
                                ) : (
                                    <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200 flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        Locked
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
