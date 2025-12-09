import React from 'react';
import SubjectsContent from './content_bar_/SubjectsContent';
import GroupsContent from './content_bar_/GroupsContent';

export default function ContentBar({ selected_category, setter_selected_note, setter_subjects, setter_selected_categories }) {
    const is_subject = selected_category && (
        selected_category.subject_id !== undefined || 
        selected_category.hasOwnProperty('notes_count') ||
        !selected_category.hasOwnProperty('created_by') 
    );

    const is_group = selected_category && (
        selected_category.group_id !== undefined || 
        selected_category.hasOwnProperty('created_by')
    );

    return (
        <div className="flex-1 overflow-hidden relative h-full">
            {is_subject ? (
                <SubjectsContent 
                    selected_category={selected_category}
                    setter_subjects={setter_subjects}
                    setter_selected_categories={setter_selected_categories}
                />
            ) : is_group ? (
                <GroupsContent 
                    selected_group={selected_category}
                />
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-gray-50">
                    <svg className="w-20 h-20 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                    </svg>
                    <h3 className="text-xl font-medium text-gray-500">No Selection</h3>
                    <p className="text-sm">Select a Subject or Group from the sidebar.</p>
                </div>
            )}
        </div>
    );
}