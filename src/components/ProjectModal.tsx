import React from 'react';
import { X, CheckCircle, ArrowRight, Sparkles, Clock, Wrench, ExternalLink } from 'lucide-react';
import { PortfolioItem } from '../types';

interface ProjectModalProps {
  project: PortfolioItem | null;
  onClose: () => void;
  onInquire: (title: string) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, onInquire }) => {
  if (!project) return null;

  return (
    <div
      id="project-detail-modal-backdrop"
      className="fixed inset-0 z-50 bg-[#033B39]/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="project-detail-modal"
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/90 hover:bg-white text-[#172222] shadow-md border border-gray-200 transition-transform active:scale-95"
          aria-label="Close project modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Top Image */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-[#064946]">
          <img loading="lazy" decoding="async"
            src={project.image}
            alt={project.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#033B39] via-transparent to-transparent opacity-80" />
          <div className="absolute bottom-5 left-6 right-6 text-white">
            <span className="inline-block px-3 py-1 bg-[#F5A623] text-[#172222] text-xs font-bold rounded-full uppercase tracking-wider mb-2">
              {project.category}
            </span>
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-white">
              {project.title}
            </h3>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Metadata Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-4 border-b border-gray-100 text-xs sm:text-sm">
            <div>
              <span className="text-[#667272] block">Project Focus</span>
              <span className="font-semibold text-[#172222]">{project.clientType}</span>
            </div>
            <div>
              <span className="text-[#667272] block flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#075B57]" /> Turnaround
              </span>
              <span className="font-semibold text-[#172222]">{project.timeline}</span>
            </div>
            <div>
              <span className="text-[#667272] block">Project Type</span>
              <span className="font-semibold text-[#075B57]">
                {project.isConcept ? 'Concept Sample' : 'Live Client Project'}
              </span>
            </div>
          </div>

          {!project.isConcept && project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#075B57] hover:text-[#033B39] underline underline-offset-2"
            >
              Visit the live site
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          {/* Detailed Narrative */}
          <div>
            <h4 className="font-bold text-base text-[#172222] mb-2">Overview & Scope</h4>
            <p className="text-sm sm:text-base text-[#667272] leading-relaxed">
              {project.fullDesc}
            </p>
          </div>

          {/* Deliverables Checklist */}
          <div>
            <h4 className="font-bold text-base text-[#172222] mb-3">Key Deliverables Provided</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {project.deliverables.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-[#172222]">
                  <CheckCircle className="w-4 h-4 text-[#F5A623] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tools & Tech Stack */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#667272] mb-2.5 flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5" /> Tools & Technology Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.toolsUsed.map((tool, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full bg-[#F7F7F2] text-[#075B57] text-xs font-semibold border border-gray-200"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="bg-[#F7F7F2] p-4 sm:p-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#667272] text-center sm:text-left">
            Interested in a similar project for your brand?
          </div>
          <button
            type="button"
            onClick={() => {
              onClose();
              onInquire(project.title);
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#075B57] hover:bg-[#064946] text-white font-semibold text-sm px-6 py-3 rounded-full transition-all shadow-md hover:shadow-lg"
          >
            <span>Request Project Like This</span>
            <ArrowRight className="w-4 h-4 text-[#F5A623]" />
          </button>
        </div>
      </div>
    </div>
  );
};
