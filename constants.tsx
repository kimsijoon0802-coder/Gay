import React from 'react';
import type { Weapon } from './types';

const SwordIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 17.5L3 6" /><path d="M15 6l5 5" /><path d="M5 21l-2-2 5-5" /><path d="M19 11l-5-5" /><path d="M21 3l-2 2" />
    </svg>
);

const AxeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 17.5l7-7-3-3-7 7-5.5-5.5-3 3z" /><path d="M12 12l6 6" />
    </svg>
);

const BowIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 21l-6-6" /><path d="M3 21c3.12-3.12 8.88-3.12 12 0" /><path d="M15 3c-3.12 3.12-3.12 8.88 0 12" />
    </svg>
);

const StaffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21l18-18" /><path d="M5 5a2 2 0 11-4 0 2 2 0 014 0z" /><path d="M19 19a2 2 0 114 0 2 2 0 01-4 0z" />
    </svg>
);

const DaggerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 17.5L5 8.5l-2 2 9.5 9.5z" /><path d="M13 11l6-6" />
    </svg>
);

const ShieldIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

const HammerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 12l-7-7" /><path d="M21 5l-8.5 8.5" /><path d="M11 3L2 12v3a6 6 0 006 6h3" />
    </svg>
);

const BootsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7.5 14.5l-3-2.5 3-2.5" />
        <path d="M16.5 14.5l3-2.5-3-2.5" />
        <path d="M2 15.5a2 2 0 002 2h16a2 2 0 002-2v-1a2 2 0 00-2-2H4a2 2 0 00-2 2v1z" />
    </svg>
);

const TomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20v2H6.5A2.5 2.5 0 014 19.5z" />
        <path d="M4 5.5A2.5 2.5 0 016.5 3H20v2H6.5A2.5 2.5 0 014 5.5z" />
        <path d="M20 3v16" />
        <path d="M2 3h2" /><path d="M2 7h2" /><path d="M2 11h2" /><path d="M2 15h2" /><path d="M2 19h2" />
    </svg>
);

const SunstoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" /><path d="M12 20v2" />
        <path d="M4.93 4.93l1.41 1.41" /><path d="M17.66 17.66l1.41 1.41" />
        <path d="M2 12h2" /><path d="M20 12h2" />
        <path d="M4.93 19.07l1.41-1.41" /><path d="M17.66 6.34l1.41-1.41" />
    </svg>
);


export const ALL_ITEMS: Weapon[] = [
    // 5 Weapons
    { id: 'sword', name: '룬 블레이드', icon: <SwordIcon />, description: '적을 쉽게 베는 날카로운 검입니다.', type: 'weapon' },
    { id: 'axe', name: '버서커의 도끼', icon: <AxeIcon />, description: '치명적인 타격을 가하는 무거운 도끼입니다.', type: 'weapon' },
    { id: 'bow', name: '매의 눈 활', icon: <BowIcon />, description: '먼 거리에서 신속한 화살을 발사합니다.', type: 'weapon' },
    { id: 'dagger', name: '그림자 단검', icon: <DaggerIcon />, description: '치명타를 위한 신속하고 조용한 무기입니다.', type: 'weapon' },
    { id: 'hammer', name: '타이탄 해머', icon: <HammerIcon />, description: '땅을 뒤흔드는 거대한 망치입니다.', type: 'weapon' },
    // 5 Abilities
    { id: 'shield', name: '이지스 방패', icon: <ShieldIcon />, description: '받는 피해를 줄여주는 튼튼한 방패입니다.', type: 'ability' },
    { id: 'staff', name: '비전 마법봉', icon: <StaffIcon />, description: '강력한 마법 투사체를 발사합니다.', type: 'ability' },
    { id: 'boots', name: '신속의 장화', icon: <BootsIcon />, description: '플레이어의 이동 속도를 증가시킵니다.', type: 'ability' },
    { id: 'tome', name: '지식의 고서', icon: <TomeIcon />, description: '경험치 획득량을 증가시킵니다.', type: 'ability' },
    { id: 'sunstone', name: '태양석', icon: <SunstoneIcon />, description: '주변의 적들에게 지속적인 피해를 입힙니다.', type: 'ability' },
];
