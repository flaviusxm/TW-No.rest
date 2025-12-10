import React from 'react';
import Subjects from './subjects_tabs_groups_/Subjects';
import Groups from './subjects_tabs_groups_/Groups';

export default function SubjectsTagsGroupsBar({
  subjects,
  setter_subjects,
  groups,
  setter_groups,
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
        <Groups
          groups={groups || []}
          setter_groups={setter_groups}
          selected_categories={selected_categories}
          setter_selected_categories={setter_selected_categories}
        />
      </div>
    </div>
  );
}