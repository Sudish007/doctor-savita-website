package com.saubhagya.clinic;

import android.content.Intent;
import android.net.Uri;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceError;
import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public void onStart() {
        super.onStart();

        WebView webView = getBridge().getWebView();
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                String url = request.getUrl().toString();

                // Open external links in system browser/app
                if (url.startsWith("https://wa.me") ||
                    url.startsWith("https://api.whatsapp.com") ||
                    url.startsWith("whatsapp://") ||
                    url.startsWith("tel:") ||
                    url.startsWith("mailto:") ||
                    url.startsWith("intent:") ||
                    url.startsWith("upi://") ||
                    url.startsWith("phonepe://") ||
                    url.startsWith("paytmmp://") ||
                    url.startsWith("gpay://") ||
                    url.contains("play.google.com") ||
                    url.contains("google.com/maps")) {

                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    try {
                        startActivity(intent);
                    } catch (Exception e) {
                        // If no app can handle it, open in browser
                        Intent browserIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                        startActivity(browserIntent);
                    }
                    return true;
                }

                // Keep drsavitak.netlify.app URLs inside the app
                if (url.contains("drsavitak.netlify.app")) {
                    return false;
                }

                // Open any other external URLs in system browser
                if (!url.contains("drsavitak.netlify.app") && url.startsWith("http")) {
                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    startActivity(intent);
                    return true;
                }

                return false;
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                if (request.isForMainFrame()) {
                    view.loadUrl("file:///android_asset/public/offline.html");
                }
            }
        });
    }
}
