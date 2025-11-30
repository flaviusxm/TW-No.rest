import React from 'react';
import Subjects from './subjects_tabs_groups_/Subjects';
import Tags from './subjects_tabs_groups_/Tags';
import Groups from './subjects_tabs_groups_/Groups';

export default function SubjectsTagsGroupsBar({
  subjects,
  setter_subjects,
  selected_categories,
  setter_selected_categories,
  setter_selected_note,
  setter_show_note_user
}) {
  return (
    <div className="h-full flex flex-col space-y-6">
      
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <Subjects
          subjects={subjects || []}
          setter_subjects={setter_subjects}
          selected_categories={selected_categories}
          setter_selected_categories={setter_selected_categories}
          setter_sel={setter_selected_categories}
          setSelectedNote={setter_selected_note}
          setter_show_note_user={setter_show_note_user}
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-4">
        <Tags 

        />
      </div>

      {/* Groups Section */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <Groups 
          
        />
      </div>
    </div>
  );
}