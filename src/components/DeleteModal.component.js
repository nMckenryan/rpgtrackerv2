import React from "react";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

// MODAL FOR CONFIRMING THE DELETION OF A RECORD

export default function DeleteModal(props) {
  const bannerTitle = props.isCampaign ? "Delete Campaign?" : "Delete Session?"
  const submit = () => {
    confirmAlert({
      //Campaign Identified by name, Session identified by character and date.
      title: bannerTitle,
      message: props.isCampaign ? 'Are you sure you want to delete ' +  props.identifier + " Campaign?" : "Delete the Session from " + props.identifier + "?",
      buttons: [
        {
          label: 'Yes',
          onClick: props.delete_function
        },
        {
          label: 'No',
          onClick: null
        }
      ]
    });
  };

  return (
    <>
      <button className="btn btn-danger"  title={bannerTitle} onClick={submit}><i className="bi bi-trash"></i></button>
    </>
  );
}
