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
                    { id: 'rookie', title: 'Rookie', description: 'Creează primele 10 notițe.', unlocked: true, date: '2023-10-01' },
                    { id: 'scribe', title: 'Scribe', description: 'Creează 50 de notițe.', unlocked: false, date: null },
                    { id: 'scholar', title: 'Scholar', description: 'Creează 100 de notițe.', unlocked: false, date: null },
                    { id: 'wordsmith', title: 'Wordsmith', description: 'Scrie peste 10.000 de cuvinte în total.', unlocked: false, date: null },
                    { id: 'novel_writer', title: 'Novel Writer', description: 'Scrie peste 50.000 de cuvinte în total.', unlocked: false, date: null },
                    { id: 'the_perfectionist', title: 'The Perfectionist', description: 'Editează notițe de cel puțin 10 ori.', unlocked: true, date: '2023-11-15' },
                    { id: 'time_traveler', title: 'Time Traveler', description: 'Creează o notiță setând o dată în viitor.', unlocked: true, date: '2023-12-01' },
                    { id: 'daily_chronicler', title: 'Daily Chronicler', description: 'Creează cel puțin o notiță timp de 7 zile la rând.', unlocked: true, date: '2023-12-05' },
                    { id: 'the_pioneer', title: 'The Pioneer', description: 'Creează primul tău subiect.', unlocked: true, date: '2023-09-20' },
                    { id: 'polymath', title: 'Polymath', description: 'Ai notițe în cel puțin 10 subiecte diferite.', unlocked: false, date: null },
                    { id: 'deep_diver', title: 'Deep Diver', description: 'Ai un subiect cu peste 50 de notițe create.', unlocked: false, date: null },
                    { id: 'the_tagger', title: 'The Tagger', description: 'Creează 20 de tag-uri diferite.', unlocked: false, date: null },
                    { id: 'the_connector', title: 'The Connector', description: 'Ai cel puțin 5 notițe asociate unui singur tag.', unlocked: true, date: '2023-10-10' },
                    { id: 'minimalist', title: 'Minimalist', description: 'Creează o notiță care are titlu, dar nu are conținut.', unlocked: true, date: '2023-12-05' },
                    { id: 'resource_gatherer', title: 'Resource Gatherer', description: 'Adună peste 50 de atașamente în total.', unlocked: false, date: null },
                    { id: 'visual_learner', title: 'Visual Learner', description: 'Atașează 10 imagini la notițe.', unlocked: false, date: null },
                    { id: 'the_streamer', title: 'The Streamer', description: 'Atașează 10 videoclipuri la notițe.', unlocked: false, date: null },
                    { id: 'researcher', title: 'Researcher', description: 'Atașează 10 PDF-uri la notițe.', unlocked: false, date: null },
                    { id: 'multimedia_master', title: 'Multimedia Master', description: 'Creează o notiță cu PDF, video și imagine.', unlocked: false, date: null },
                    { id: 'the_founder', title: 'The Founder', description: 'Creează primul tău grup.', unlocked: true, date: '2023-11-01' },
                    { id: 'community_leader', title: 'Community Leader', description: 'Creează 5 grupuri.', unlocked: false, date: null },
                    { id: 'squad_goals', title: 'Squad Goals', description: 'Ai cel puțin 10 oameni într-un grup creat de tine.', unlocked: false, date: null },
                    { id: 'night_owl', title: 'Night Owl', description: 'Creează 5 notițe între orele 00:00 și 05:00.', unlocked: true, date: '2023-12-10' },
                    { id: 'early_bird', title: 'Early Bird', description: 'Creează 5 notițe între orele 05:00 și 08:00.', unlocked: false, date: null },
                    { id: 'marathon_runner', title: 'Marathon Runner', description: '30 de zile la rând cu cel puțin o notiță creată.', unlocked: false, date: null },
                    { id: 'spring_cleaner', title: 'Spring Cleaner', description: 'Șterge o notiță veche.', unlocked: true, date: '2023-10-30' },
                    { id: 'full_stack', title: 'Full Stack', description: 'Ai creat un subiect, un tag, o notiță și un grup.', unlocked: true, date: '2023-11-25' },
                    { id: 'the_architect', title: 'The Architect', description: 'Scrie o singură notiță de peste 2000 de cuvinte.', unlocked: false, date: null },
                    { id: 'open_source', title: 'Open Source', description: 'Partajează (share) cel puțin 10 notițe.', unlocked: false, date: null },
                    { id: 'infinity_gauntlet', title: 'Infinity Gauntlet', description: 'Colectează toate celelalte 29 de badge-uri.', unlocked: false, date: null }
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
                        <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Your Badges</h2>
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