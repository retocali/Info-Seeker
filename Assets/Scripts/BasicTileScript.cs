using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class BasicTileScript : MonoBehaviour {

	// Use this for initialization
	void Start () {
		
	}
	
	// Update is called once per frame
	void Update () {
		
	}

	void OnMouseDown()
	{
		Debug.Log("Rotated!");
		this.gameObject.transform.Rotate(new Vector3(0,0,90f)); 
		Debug.Log("Rotated!");
	}
}
