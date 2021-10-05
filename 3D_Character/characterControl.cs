using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class new_anima : MonoBehaviour
{
    public Animator anmatr;
    int pose = 0;
    private void Awake()
    {
        anmatr = GetComponent<Animator>();

    }
    // Start is called before the first frame update
    void Start()
    {

    }

    // Update is called once per frame
    void Update()
    {
        anmatr.SetInteger("New Int", pose);
    }

    void changeAnimation(int ani)
    {
        pose = ani;
    }
}