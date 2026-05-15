import Achievements from '@uxcore/components/Achievements';
import useMobile from '@uxcore/hooks/useMobile';
import { FC } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

import {
  AchievementsBoardProps,
  providedChildProps,
  providedProps,
} from './AchievementBoard.types';

import styles from '../../../pages/user/[userId]/userId.module.scss';

const AchievementsBoard: FC<AchievementsBoardProps> = ({
  achievements,
  handleOnDragEnd,
  generalAchievements,
  receivedAchievementPercentage,
  isLoading,
  specialAchievements,
  hiddenAchievement,
  keepsimpleAchievements,
}) => {
  const { isMobile } = useMobile()[1];

  const unlockedKeepsimpleAchievements = keepsimpleAchievements[0]?.unlockedAt
    ? keepsimpleAchievements
    : [];

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="achievements">
        {(provided: providedProps) => (
          <div
            className={styles.achievementsList}
            {...provided.droppableProps}
            // @ts-ignore
            ref={provided.innerRef}
          >
            {achievements.map(
              ({ id, pageIcon, pageName, headerColor }, index) => (
                <Draggable
                  key={id.toString()}
                  draggableId={id.toString()}
                  index={index}
                  // Remove after making it draggable again
                  isDragDisabled={false}
                >
                  {(provided: providedChildProps) => (
                    // Uncomment after making it draggable again
                    // <div ref={provided.innerRef} {...provided.draggableProps}>
                    <div className={styles.achievementsDraggable}>
                      <Achievements
                        hiddenAchievement={hiddenAchievement}
                        headerColor={headerColor}
                        pageName={pageName}
                        pageIcon={pageIcon}
                        dragHandleProps={!isMobile && provided.dragHandleProps}
                        isUXCoreAchievements={pageName === 'UXCore'}
                        generalAchievements={
                          pageName === 'KeepSimple'
                            ? unlockedKeepsimpleAchievements
                            : generalAchievements
                        }
                        specialAchievements={
                          pageName === 'KeepSimple' ? null : specialAchievements
                        }
                        receivedAchievementPercentage={
                          pageName === 'KeepSimple'
                            ? receivedAchievementPercentage.keepSimple
                            : receivedAchievementPercentage.uxCore
                        }
                        isLoading={isLoading}
                      />
                    </div>
                  )}
                </Draggable>
              ),
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default AchievementsBoard;
