import React from 'react';
import CreateProject from '../features/createProject/CreateProject';

function EditProjectScreen({route}) {
  const {project} = route.params;

  return <CreateProject project={project} editMode />;
}

export default EditProjectScreen;
