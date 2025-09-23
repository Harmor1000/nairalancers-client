import React from "react";
import "./GigSkeleton.scss";

function GigSkeleton() {
  return (
    <div className="gig-skeleton">
      <div className="container">
        {/* LEFT SIDE */}
        <div className="left">
          {/* Breadcrumbs skeleton */}
          <div className="breadcrumbs-skeleton">
            <div className="skeleton-line short"></div>
          </div>

          {/* Title skeleton */}
          <div className="title-skeleton">
            <div className="skeleton-line long"></div>
            <div className="skeleton-line medium"></div>
          </div>

          {/* User info skeleton */}
          <div className="user-skeleton">
            <div className="skeleton-circle"></div>
            <div className="user-details-skeleton">
              <div className="skeleton-line short"></div>
              <div className="skeleton-line very-short"></div>
            </div>
          </div>

          {/* Main image skeleton */}
          <div className="image-skeleton">
            <div className="main-image-skeleton"></div>
            <div className="thumbnails-skeleton">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="thumbnail-skeleton"></div>
              ))}
            </div>
          </div>

          {/* Description section skeleton */}
          <div className="section-skeleton">
            <div className="section-title-skeleton"></div>
            <div className="description-skeleton">
              <div className="skeleton-line long"></div>
              <div className="skeleton-line long"></div>
              <div className="skeleton-line medium"></div>
              <div className="skeleton-line long"></div>
            </div>
          </div>

          {/* Seller info skeleton */}
          <div className="seller-skeleton">
            <div className="section-title-skeleton"></div>
            <div className="seller-header-skeleton">
              <div className="skeleton-circle large"></div>
              <div className="seller-details-skeleton">
                <div className="skeleton-line medium"></div>
                <div className="skeleton-line very-short"></div>
                <div className="skeleton-button"></div>
              </div>
            </div>
            <div className="stats-skeleton">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="stat-skeleton">
                  <div className="skeleton-line very-short"></div>
                  <div className="skeleton-line short"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews skeleton */}
          <div className="reviews-skeleton">
            <div className="section-title-skeleton"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="review-skeleton">
                <div className="review-header-skeleton">
                  <div className="skeleton-circle"></div>
                  <div className="skeleton-line short"></div>
                </div>
                <div className="skeleton-line medium"></div>
                <div className="skeleton-line long"></div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="right">
          <div className="order-panel-skeleton">
            {/* Package title */}
            <div className="skeleton-line medium"></div>
            
            {/* Price */}
            <div className="price-skeleton">
              <div className="skeleton-line short thick"></div>
            </div>

            {/* Description */}
            <div className="package-desc-skeleton">
              <div className="skeleton-line long"></div>
              <div className="skeleton-line medium"></div>
            </div>

            {/* Delivery info */}
            <div className="delivery-skeleton">
              <div className="delivery-item-skeleton">
                <div className="skeleton-icon"></div>
                <div className="skeleton-line short"></div>
              </div>
              <div className="delivery-item-skeleton">
                <div className="skeleton-icon"></div>
                <div className="skeleton-line short"></div>
              </div>
            </div>

            {/* Features */}
            <div className="features-skeleton">
              <div className="skeleton-line short"></div>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="feature-skeleton">
                  <div className="skeleton-icon small"></div>
                  <div className="skeleton-line medium"></div>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="buttons-skeleton">
              <div className="skeleton-button large primary"></div>
              <div className="skeleton-button large secondary"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GigSkeleton;