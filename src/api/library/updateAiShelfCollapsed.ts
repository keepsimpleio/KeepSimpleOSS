import { updateLibrary } from '@api/library/updateLibrary';

export const updateAiShelfCollapsed = async (
  libraryId: number,
  collapsed: boolean,
): Promise<void> => {
  let outcome = 'failed';
  try {
    const result = await updateLibrary(libraryId, {
      aiShelfCollapsed: collapsed,
    });
    if (result.data?.attributes.aiShelfCollapsed !== collapsed) {
      throw new Error('AI shelf preference was not saved.');
    }
    outcome = 'saved';
  } finally {
    console.info(
      JSON.stringify({
        mechanism: 'library.aiShelfCollapsed',
        at: new Date().toISOString(),
        libraryId,
        collapsed,
        outcome,
      }),
    );
  }
};
