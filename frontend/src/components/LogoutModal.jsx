import React from 'react';

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="modal modal-open">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Confirm Logout</h3>
                <p className="py-4">Are you sure you want to logout?</p>
                <div className="modal-action">
                    <button onClick={onClose} className="btn btn-ghost">Cancel</button>
                    <button onClick={onConfirm} className="btn btn-primary text-white">Logout</button>
                </div>
            </div>
        </div>
    );
};

export default LogoutModal;