import { GraduationCap } from 'lucide-react';
import type { Project } from '@/lib/types';

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

export default function ProjectCard({ project }: { project: Project }) {
  const mainLang = project.languages && project.languages.length > 0 ? project.languages[0] : "O'quv markaz";

  return (
    <article className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0_12px_32px_-4px_rgba(19,27,46,0.06)] flex flex-col group hover:shadow-[0_20px_40px_-4px_rgba(19,27,46,0.1)] transition-shadow duration-300">
      <div className="h-56 relative overflow-hidden bg-surface-container">
        {project.photoUrl ? (
          <img
            src={project.photoUrl}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-container to-secondary-container">
            <span className="material-symbols-outlined text-on-primary-container text-6xl">school</span>
          </div>
        )}
        <div className="absolute top-4 right-4 bg-surface/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
          <span className="material-symbols-outlined text-[16px] text-primary">bookmark</span>
          <span className="text-xs font-semibold text-primary">{mainLang}</span>
        </div>
      </div>
      <div className="p-8 flex flex-col flex-grow">
        <h3 className="font-headline text-2xl font-bold text-on-surface mb-2">
          {project.title}
        </h3>
        <div className="flex items-center gap-2 text-on-surface-variant text-sm mb-5">
          <span className="material-symbols-outlined text-[18px]">person</span>
          Tadbirkor: {project.ownerName}
        </div>
        <p className="text-on-surface-variant leading-relaxed text-base mb-6 flex-grow">
          Uy hududda ta&apos;lim sifatini oshirish va yoshlar bandligini ta&apos;minlash maqsadida moliyalashtirilgan. 
          Hozirda {project.studentsCount || "ko'plab"} o&apos;quvchilar ta&apos;lim olishmoqda.
        </p>
        
        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {project.loanAmount && (
            <div>
              <p className="text-xs text-on-surface-variant mb-1">Ssuda miqdori</p>
              <p className="font-semibold text-primary">{project.loanAmount} mln</p>
            </div>
          )}
          {project.fundedAt && (
            <div>
              <p className="text-xs text-on-surface-variant mb-1">Sana</p>
              <p className="font-medium text-on-surface-variant">{formatDate(project.fundedAt as unknown as string)}</p>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-outline-variant/20 flex justify-between items-center cursor-pointer group/btn">
          <span className="text-sm font-medium text-primary group-hover/btn:underline underline-offset-4">Batafsil o&apos;qish</span>
          <span className="material-symbols-outlined text-primary transition-transform group-hover/btn:translate-x-1">arrow_forward</span>
        </div>
      </div>
    </article>
  );
}
