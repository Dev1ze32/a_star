import React, { useState } from 'react';
import { X, User, ArrowLeft, GraduationCap, ChevronRight } from 'lucide-react';

// Dummy Data - Replace with real API data later
const PROFESSORS = {
  'COE': [
    { name: 'Engr. John Doe', title: 'Dean of Engineering' },
    { name: 'Engr. Jane Smith', title: 'Civil Engineering Head' },
    { name: 'Engr. Mike Johnson', title: 'Computer Engineering' }
  ],
  'COED': [
    { name: 'Dr. Sarah Lee', title: 'Dean of Education' },
    { name: 'Prof. Tom Brown', title: 'Secondary Education' }
  ],
  'CHAS': [
    { name: 'Dr. Emily White', title: 'Dean of Nursing' },
    { name: 'Mr. Chris Green', title: 'Medical Technology' }
  ],
  'CCS': [
    { name: 'Prof. Alan Turing', title: 'Dean of Computer Studies' },
    { name: 'Mr. Ada Lovelace', title: 'Information Technology' },
    { name: 'Dr. Grace Hopper', title: 'Computer Science' }
  ],
  'CBAA': [
    { name: 'Ms. Mary Black', title: 'Accountancy Chair' },
    { name: 'Mr. James Wilson', title: 'Business Admin' }
  ],
  'CAS': [
    { name: 'Dr. Robert Frost', title: 'English Department' },
    { name: 'Ms. Sylvia Plath', title: 'Psychology' }
  ]
};

export const FindProfessorModal = ({ isOpen, onClose }) => {
  const [selectedDept, setSelectedDept] = useState(null);

  if (!isOpen) return null;

  // Reset selection when closing
  const handleClose = () => {
    setSelectedDept(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900 bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-sm md:max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6" />
            <h2 className="text-lg font-bold">Find My Professor</h2>
          </div>
          <button 
            onClick={handleClose}
            className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
          {!selectedDept ? (
            /* 1. Department Selection View */
            <div className="space-y-4">
              <p className="text-sm text-slate-500 text-center font-medium">Select a Department</p>
              <div className="grid grid-cols-2 gap-3">
                {Object.keys(PROFESSORS).map(dept => (
                  <button
                    key={dept}
                    onClick={() => setSelectedDept(dept)}
                    className="flex flex-col items-center justify-center p-4 bg-white border-2 border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 hover:shadow-md transition-all group"
                  >
                    <span className="text-2xl font-black text-slate-400 group-hover:text-blue-600 mb-1">{dept}</span>
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold group-hover:text-blue-400">View Faculty</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* 2. Professor List View */
            <div className="flex flex-col h-full">
              <button
                onClick={() => setSelectedDept(null)}
                className="flex items-center text-sm text-slate-500 hover:text-blue-600 mb-4 transition-colors font-bold self-start"
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Departments
              </button>

              <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-2">
                <h3 className="text-xl font-bold text-slate-800">{selectedDept} Faculty</h3>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-bold">
                  {PROFESSORS[selectedDept].length} Staff
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {PROFESSORS[selectedDept].map((prof, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-slate-100 hover:border-blue-300 transition-colors cursor-default group">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                      <User className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-slate-800 text-sm">{prof.name}</div>
                      <div className="text-xs text-slate-500">{prof.title}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};