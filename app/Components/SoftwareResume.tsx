"use client";

import React, { useState } from "react";

export default function SoftwareResume() {
  const [activeTab, setActiveTab] = useState<"experience" | "education" | "skills">("experience");

  const experiences = [
    {
      role: "Software Engineering Intern",
      company: "Innovision LLC",
      location: "Dayton, OH",
      period: "Jan 2026 - Present",
      bullets: [
        "Developing high-performance user interfaces and responsive layouts using React, Next.js, and Tailwind CSS.",
        "Building scalable REST APIs with Python and FastAPI, integrating data-driven features and AI evaluations.",
        "Automating end-to-end user-scenario audits using browser automation tools like Playwright, reducing regression verification times by 30%."
      ],
      tag: "Full-Stack"
    },
    {
      role: "AI Evaluator (Contract)",
      company: "Project Alloy",
      location: "Remote",
      period: "Mar 2026 - Present",
      bullets: [
        "Analyzing AI-generated technical solutions and complex explanations across STEM domains to ensure safety, alignment, and formatting standards.",
        "Tuning prompt engineering criteria and system instructions to improve response factual accuracy and code structure.",
        "Authoring test suites and target benchmark code to validate model intelligence in coding and mathematical reasoning."
      ],
      tag: "AI & Alignment"
    },
    {
      role: "Software Engineer",
      company: "Tata Consultancy Services (TCS)",
      location: "Hyderabad, India",
      period: "Nov 2020 - Aug 2024",
      bullets: [
        "Designed and maintained core enterprise Java/Spring Boot microservices, serving over 10M+ operations daily.",
        "Collaborated in Agile sprints to coordinate code reviews, debug production bottlenecks, and maintain 99.9% service uptime.",
        "Refactored legacy database queries and structured indexing, reducing query load latency profiles by 25%."
      ],
      tag: "Backend & Systems"
    }
  ];

  const skillGroups = [
    {
      category: "2D Game Dev & Physics",
      skills: [
        { name: "Solar2D (Corona SDK) Core", level: 95 },
        { name: "Lua Scripting & Architecture", level: 90 },
        { name: "Box2D Physics & Collisions", level: 88 },
        { name: "Sprite Sheet & UI Design", level: 85 }
      ]
    },
    {
      category: "Languages & Shells",
      skills: [
        { name: "TypeScript & JavaScript", level: 90 },
        { name: "Java (Spring Boot)", level: 85 },
        { name: "Python (FastAPI)", level: 82 },
        { name: "SQL (PostgreSQL)", level: 80 }
      ]
    },
    {
      category: "Web & Automation",
      skills: [
        { name: "React & Next.js Frameworks", level: 88 },
        { name: "Tailwind CSS Styling", level: 90 },
        { name: "Playwright Browser Auditing", level: 85 },
        { name: "Docker & CI/CD Pipelines", level: 75 }
      ]
    }
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      
      {/* Dossier Tabs Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/10 pb-4 gap-4">
        <h3 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#10b981] animate-pulse"></span>
          Credentials Folder (Resumé)
        </h3>
        
        {/* Navigation Tabs */}
        <div className="flex bg-slate-950 border border-white/5 p-0.5 rounded-xl text-xs font-mono">
          <button
            onClick={() => setActiveTab("experience")}
            className={`px-4 py-1.5 font-bold uppercase rounded-lg transition-all ${
              activeTab === "experience"
                ? "bg-[#3b82f6] text-white shadow-[0_0_10px_rgba(59,130,246,0.2)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            [EXP_TIMELINE]
          </button>
          <button
            onClick={() => setActiveTab("education")}
            className={`px-4 py-1.5 font-bold uppercase rounded-lg transition-all ${
              activeTab === "education"
                ? "bg-[#3b82f6] text-white shadow-[0_0_10px_rgba(59,130,246,0.2)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            [EDU_DOSSIER]
          </button>
          <button
            onClick={() => setActiveTab("skills")}
            className={`px-4 py-1.5 font-bold uppercase rounded-lg transition-all ${
              activeTab === "skills"
                ? "bg-[#3b82f6] text-white shadow-[0_0_10px_rgba(59,130,246,0.2)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            [SKILLS_INDEX]
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="min-h-[220px]">
        
        {/* TAB 1: EXPERIENCE */}
        {activeTab === "experience" && (
          <div className="flex flex-col gap-4 animate-fade-in">
            {experiences.map((exp) => (
              <div 
                key={exp.company} 
                className="card bg-slate-900/40 border border-white/[0.08] backdrop-blur-xl p-6 rounded-3xl hover:border-indigo-500/30 transition-all duration-300 flex flex-col gap-3 shadow-lg"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h4 className="text-base font-black text-white leading-tight">{exp.role}</h4>
                    <p className="text-xs text-slate-400 font-bold mt-1">
                      {exp.company} &middot; <span className="font-semibold text-slate-500">{exp.location}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black uppercase tracking-wider text-[#406E8E] bg-[#406E8E]/10 border border-[#406E8E]/20 px-2.5 py-0.5 rounded-full">
                      {exp.tag}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-950/50 px-3 py-1 rounded-lg border border-white/5 font-mono">
                      {exp.period}
                    </span>
                  </div>
                </div>

                <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-400 leading-relaxed">
                  {exp.bullets.map((bullet, idx) => (
                    <li key={idx} className="hover:text-slate-200 transition-colors">{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: EDUCATION */}
        {activeTab === "education" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-fade-in">
            {/* Degree Card */}
            <div className="md:col-span-7 flex flex-col gap-4">
              <div className="card bg-slate-900/40 border border-white/[0.08] backdrop-blur-xl p-6 rounded-3xl h-full shadow-lg">
                <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">Degree Credentials</span>
                <h4 className="text-lg font-black text-white mt-1 leading-snug">
                  M.S. in Information Technology
                </h4>
                <p className="text-sm font-bold text-slate-300 mt-1">University of Cincinnati</p>
                <p className="text-xs text-slate-500 mt-1">Aug 2024 - Dec 2025 | Cumulative GPA: <strong className="text-white">3.97 / 4.0</strong></p>
                
                <p className="text-xs text-slate-400 italic mt-6 border-l-2 border-indigo-500 pl-3 leading-relaxed">
                  "This degree laid the academic foundation for algorithm complexity analysis, database architecture, and software design principles. Applying these structures makes my game physics loops highly optimal."
                </p>
              </div>
            </div>

            {/* Key Coursework */}
            <div className="md:col-span-5 flex flex-col gap-4">
              <div className="card bg-slate-900/40 border border-white/[0.08] backdrop-blur-xl p-6 rounded-3xl h-full shadow-lg">
                <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">Academic Coursework</span>
                <h4 className="text-base font-black text-white mt-1">Key Modules Completed</h4>
                
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {[
                    "Design of Algorithms",
                    "Mobile App Tech",
                    "HCI & Usability",
                    "Advanced Databases",
                    "Data Engineering",
                    "Web Architecture"
                  ].map((course) => (
                    <div 
                      key={course} 
                      className="text-[10px] font-bold text-slate-300 bg-slate-950/70 p-2.5 rounded-xl border border-white/5 text-center flex items-center justify-center"
                    >
                      {course}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SKILLS INDEX */}
        {activeTab === "skills" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
            {skillGroups.map((group) => (
              <div 
                key={group.category}
                className="card bg-slate-900/40 border border-white/[0.08] backdrop-blur-xl p-6 rounded-3xl shadow-lg flex flex-col gap-4"
              >
                <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider font-mono">
                  {group.category.toUpperCase()}
                </span>
                
                <div className="flex flex-col gap-4">
                  {group.skills.map((s) => (
                    <div key={s.name} className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-300">
                        <span>{s.name}</span>
                        <span className="text-[#3b82f6] font-mono">{s.level}%</span>
                      </div>
                      {/* Meter bar */}
                      <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-1000"
                          style={{ width: `${s.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
