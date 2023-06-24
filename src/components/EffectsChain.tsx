import React, { useRef, useState, useEffect } from 'react';

const EffectsChain = ({ effects, setEffects }) => {

  interface IData {
    idx: number;
    effect: string;
  }

  const handleDragStart = (e, idx, effect) => {
    const data:IData = {idx, effect};
    e.dataTransfer.setData("application/json", JSON.stringify(data));
    e.dataTransfer.effectAllowed = 'move';
  }
  
  const handleDragOver = (e) => {
    e.preventDefault();
  }
  
  const handleDrop = (e) => {
    const draggedItemData:IData = JSON.parse(e.dataTransfer.getData("application/json"));
    const dropIdx = parseInt(e.target.dataset.index);
    const newEffects = [...effects];
    newEffects.splice(draggedItemData.idx, 1);
    newEffects.splice(dropIdx, 0, draggedItemData.effect);
    setEffects(newEffects);
  }

  return (
    <div className="effects-chain">
      {effects.map((effect, idx) => {
        return (
          <>
            <div
              draggable
              onDragStart={e => handleDragStart(e, idx, effect)}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              id={`${idx}_${effect}`}
              key={`${idx}_${effect}`}
              data-index={idx}
            >
              {effect}
            </div>
            <span>{`=> `}</span>
          </>
        )
      })}

      {effects.length > 0 && <div className="out"> out</div>}
    </div>
  )
}


export default EffectsChain;

