package com.example.gradproj;

import android.content.Intent;
import android.media.MediaRecorder;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;

import androidx.appcompat.app.AppCompatActivity;

import java.io.IOException;

public class RecordActivity extends AppCompatActivity {

    MediaRecorder recorder;

    @Override
    protected void onCreate(Bundle savedInstanceState){
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_record);

        Button Record_complete = (Button)findViewById(R.id.Record_complete);
        Record_complete.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v){
                if(recorder != null){
                    recorder.stop();
                    recorder.release();
                    recorder = null;
                }
                recorder = new MediaRecorder();

                try{
                    recorder.prepare();
                    recorder.start();
                } catch (Exception ex) {
                    Log.e("SampleAudioRecorder", "Exception", ex);
                }

                finish();
            }
        });
    }
}
