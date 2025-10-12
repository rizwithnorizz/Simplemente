import React from "react";

const Category = ( {
    onClose, onConfirm, isOpen
} ) => {
    if (!isOpen) return null;


    
  return (
    <>
      <div className="fixed inset-0 bg-black opacity-30 z-[998]" />
      <div className="fixed inset-0 flex items-center justify-center z-[999]">
        <div className="bg-white rounded-lg p-6 md:w-2.5/4 w-3/4"></div>
      </div>
    </>
  );
};

export default Category;
