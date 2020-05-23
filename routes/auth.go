package routes

import (
	"context"
	"github.com/dgrijalva/jwt-go"
	"net/http"
)

type jwtClaims struct {
	Email string `json:"email"`
	ID    string `json:"id"`
	jwt.StandardClaims
}

// Authenticate is authentication middleware
func (app *App) Authenticate(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authCookie, err := r.Cookie("jwt-token")
		if err != nil {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		tokenString := authCookie.Value
		token, err := jwt.ParseWithClaims(tokenString, &jwtClaims{}, func(token *jwt.Token) (interface{}, error) {
			return tokenSignature, nil
		})
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		if !token.Valid {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		claims, ok := token.Claims.(*jwtClaims)
		if !ok {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("error asserting claims"))
			return
		}

		ctx := context.WithValue(r.Context(), "claims", claims)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
