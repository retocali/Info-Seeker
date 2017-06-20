using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class BasicTileScript : MonoBehaviour {

	// Use this for initialization
	void Start () {
		
	}
	
	// Update is called once per frame
	void Update () {
		 if ((Input.touchCount > 0) && (Input.GetTouch(0).phase == TouchPhase.Began)) {
			Ray raycast = Camera.main.ScreenPointToRay(Input.GetTouch(0).position);
			RaycastHit raycastHit;
			if (Physics.Raycast(raycast, out raycastHit)) {
				Debug.Log("Something Hit");
				raycastHit.collider.gameObject.transform.Rotate(new Vector3(0,0,90f));
			}
    }
	}

	void OnMouseDown()
	{
		this.gameObject.transform.Rotate(new Vector3(0,0,90f)); 
	}
}
