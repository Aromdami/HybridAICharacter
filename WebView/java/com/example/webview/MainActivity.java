package com.example.webview;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.webkit.JsResult;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;

public class MainActivity extends AppCompatActivity {
    Button openCloseButton;
    RelativeLayout searchLayout;
    EditText addressText;
    Button moveButton;

    Animation upAnim;
    Animation downAnim;

    boolean isSearchOpen = false;

    WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        openCloseButton = (Button) findViewById(R.id.openCloseButton);
        searchLayout = (RelativeLayout) findViewById(R.id.searchLayout);
        addressText = (EditText) findViewById(R.id.address);
        moveButton = (Button) findViewById(R.id.moveButton);

        upAnim = AnimationUtils.loadAnimation(this, R.anim.upflow);
        downAnim = AnimationUtils.loadAnimation(this, R.anim.downflow);

        OpenSearchAnimationListener animationListener = new OpenSearchAnimationListener();
        upAnim.setAnimationListener(animationListener);
        downAnim.setAnimationListener(animationListener);

        openCloseButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (isSearchOpen) {
                    searchLayout.startAnimation(upAnim);
                }
                else {
                    searchLayout.bringToFront();
                    searchLayout.setVisibility(View.VISIBLE);
                    searchLayout.startAnimation(downAnim);
                }
            }
        });

        webView = (WebView) findViewById(R.id.webView);
        webView.setWebViewClient(new WebViewClient());
        webView.setWebChromeClient(new WebBrowserClient());

        moveButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                webView.loadUrl(addressText.getText().toString());
                openCloseButton.performClick();
            }
        });
    }

    private class OpenSearchAnimationListener implements Animation.AnimationListener {
        @Override
        public void onAnimationEnd(Animation animation) {
            if (isSearchOpen) {
                searchLayout.setVisibility(View.INVISIBLE);
                openCloseButton.setText(getString(R.string.open));
                isSearchOpen = false;
            }
            else {
                openCloseButton.setText(getString(R.string.close));
                isSearchOpen = true;
            }
        }

        @Override
        public void onAnimationStart(Animation animation) {

        }

        @Override
        public void onAnimationRepeat(Animation animation) {

        }
    }

    final class WebBrowserClient extends WebChromeClient {
        @Override
        public boolean onJsAlert(WebView view, String url, String message, JsResult result) {
            result.confirm();

            return true;
        }
    }
}