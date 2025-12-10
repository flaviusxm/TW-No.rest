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
    'rookie': rookieImg,
    'scribe': scribeImg,
    'scholar': scholarImg,
    'wordsmith': wordsmithImg,
    'novel_writer': novelWriterImg,
    'the_perfectionist': thePerfectionistImg,
    'time_traveler': timeTravelerImg,
    'daily_chronicler': dailyChroniclerImg,
    'the_pioneer': thePioneerImg,
    'polymath': polymathImg,
    'deep_diver': deepDiverImg,
    'the_tagger': theTaggerImg,
    'the_connector': theConnectorImg,
    'minimalist': minimalistImg,
    'resource_gatherer': resourceGathererImg,
    'visual_learner': visualLearnerImg,
    'the_streamer': theStreamerImg,
    'researcher': researcherImg,
    'multimedia_master': multimediaMasterImg,
    'the_founder': theFounderImg,
    'community_leader': communityLeaderImg,
    'squad_goals': squadGoalsImg,
    'night_owl': nightOwlImg,
    'early_bird': earlyBirdImg,
    'marathon_runner': marathonRunnerImg,
    'spring_cleaner': springCleanerImg,
    'full_stack': fullStackImg,
    'the_architect': theArchitectImg,
    'open_source': openSourceImg,
    'infinity_gauntlet': infinityGauntletImg
};

export default function AchievementsContent() {

    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetch_achievements = async () => {
            setLoading(true);
            try {
                const realAchievementsData = [
                    { id: 'rookie', title: 'Rookie', description: 'Create your first 10 notes.', unlocked: true, date: '2023-10-01' },
                    { id: 'scribe', title: 'Scribe', description: 'Create 50 notes.', unlocked: false, date: null },
                    { id: 'scholar', title: 'Scholar', description: 'Create 100 notes.', unlocked: false, date: null },
                    { id: 'wordsmith', title: 'Wordsmith', description: 'Write over 10,000 words in total.', unlocked: false, date: null },
                    { id: 'novel_writer', title: 'Novel Writer', description: 'Write over 50,000 words in total.', unlocked: false, date: null },
                    { id: 'the_perfectionist', title: 'The Perfectionist', description: 'Edit notes at least 10 times.', unlocked: true, date: '2023-11-15' },
                    { id: 'time_traveler', title: 'Time Traveler', description: 'Create a note with a future date.', unlocked: true, date: '2023-12-01' },
                    { id: 'daily_chronicler', title: 'Daily Chronicler', description: 'Create at least one note for 7 consecutive days.', unlocked: true, date: '2023-12-05' },
                    { id: 'the_pioneer', title: 'The Pioneer', description: 'Create your first subject.', unlocked: true, date: '2023-09-20' },
                    { id: 'polymath', title: 'Polymath', description: 'Have notes in at least 10 different subjects.', unlocked: false, date: null },
                    { id: 'deep_diver', title: 'Deep Diver', description: 'Have a subject with over 50 notes.', unlocked: false, date: null },
                    { id: 'the_tagger', title: 'The Tagger', description: 'Create 20 different tags.', unlocked: false, date: null },
                    { id: 'the_connector', title: 'The Connector', description: 'Have at least 5 notes associated with a single tag.', unlocked: true, date: '2023-10-10' },
                    { id: 'minimalist', title: 'Minimalist', description: 'Create a note with a title but no content.', unlocked: true, date: '2023-12-05' },
                    { id: 'resource_gatherer', title: 'Resource Gatherer', description: 'Collect over 50 attachments in total.', unlocked: false, date: null },
                    { id: 'visual_learner', title: 'Visual Learner', description: 'Attach 10 images to notes.', unlocked: false, date: null },
                    { id: 'the_streamer', title: 'The Streamer', description: 'Attach 10 videos to notes.', unlocked: false, date: null },
                    { id: 'researcher', title: 'Researcher', description: 'Attach 10 PDFs to notes.', unlocked: false, date: null },
                    { id: 'multimedia_master', title: 'Multimedia Master', description: 'Create a note containing a PDF, a video, and an image.', unlocked: false, date: null },
                    { id: 'the_founder', title: 'The Founder', description: 'Create your first group.', unlocked: true, date: '2023-11-01' },
                    { id: 'community_leader', title: 'Community Leader', description: 'Create 5 groups.', unlocked: false, date: null },
                    { id: 'squad_goals', title: 'Squad Goals', description: 'Have at least 10 members in a group you created.', unlocked: false, date: null },
                    { id: 'night_owl', title: 'Night Owl', description: 'Create 5 notes between 00:00 and 05:00.', unlocked: true, date: '2023-12-10' },
                    { id: 'early_bird', title: 'Early Bird', description: 'Create 5 notes between 05:00 and 08:00.', unlocked: false, date: null },
                    { id: 'marathon_runner', title: 'Marathon Runner', description: 'Create at least one note for 30 consecutive days.', unlocked: false, date: null },
                    { id: 'spring_cleaner', title: 'Spring Cleaner', description: 'Delete an old note.', unlocked: true, date: '2023-10-30' },
                    { id: 'full_stack', title: 'Full Stack', description: 'Create a subject, a tag, a note, and a group.', unlocked: true, date: '2023-11-25' },
                    { id: 'the_architect', title: 'The Architect', description: 'Write a single note with over 2000 words.', unlocked: false, date: null },
                    { id: 'open_source', title: 'Open Source', description: 'Share at least 10 notes.', unlocked: false, date: null },
                    { id: 'infinity_gauntlet', title: 'Infinity Gauntlet', description: 'Collect all other 29 badges.', unlocked: false, date: null }
                ];
                
                setTimeout(() => {
                    setAchievements(realAchievementsData);
                    setLoading(false);
                }, 300);

            } catch (err) {
                console.error("Eroare incarcare achievements:", err);
                setLoading(false);
            }
        };

        fetch_achievements();
    }, []);

    return (
        <div className="flex-1 p-6 overflow-auto h-full bg-gray-50">
            
            <div className="mb-6 border-b pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                    <div className=" p-2 rounded-lg text-yellow-500">
                            <svg 
                                className="w-8 h-8" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24" 
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a7 7 0 007-7V4H5v4a7 7 0 007 7z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v7" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 22h12" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 4H4.5a2.5 2.5 0 000 5H5" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 4h.5a2.5 2.5 0 010 5H19" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Your Achievements</h2>
                            <p className="text-sm text-gray-500">Collect them all to become a master!</p>
                        </div>
                    </div>
                    
                    <div className="flex gap-3">
                         <div className="px-4 py-2 rounded-lg bg-white border text-sm text-gray-600 font-medium shadow-sm">
                            {achievements.filter(a => a.unlocked).length} / {achievements.length} Unlocked
                        </div>
                    </div>
                </div>
            </div>

            {loading ? <p className="text-center text-gray-400 mt-10">Loading badges...</p> : (
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
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=?'; }} 
                                />
                            </div>

                            <h4 className={`font-bold text-base mb-1 ${ach.unlocked ? 'text-gray-800' : 'text-gray-400'}`}>
                                {ach.title}
                            </h4>
                            <p className="text-xs text-gray-500 mb-2 h-8 line-clamp-2 px-1 flex items-center justify-center">
                                {ach.description}
                            </p>
                            
                            <div className="mt-auto w-full pt-2 border-t border-gray-100 flex justify-center">
                                {ach.unlocked ? (
                                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100 flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        Unlocked
                                    </span>
                                ) : (
                                    <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200 flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
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