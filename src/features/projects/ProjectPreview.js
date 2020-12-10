import React from 'react';
import {Project} from 'project';

function ProjectPreview({project}) {
  return <Project viewAs="preview" project={project} />;
}

export default ProjectPreview;
