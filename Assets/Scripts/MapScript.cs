
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MapScript : MonoBehaviour {

	public GameObject[] tilesArray;

	public const int width = 3;
	public const int length = 3;


	// Use this for initialization
	void Start () {
		for (int x = 0; x < width; x++) {
			for (int y = 0; y < length; y++) {
				Vector2 pos = new Vector2(1.4f*x,1.4f*y);
				Instantiate(tilesArray[(int)Random.Range(0,tilesArray.Length)],pos, Quaternion.identity, this.gameObject.transform);
			}
		}
	}
	
	// Update is called once per frame
	void Update () {
		
	}
}
